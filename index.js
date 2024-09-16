import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(cors());
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database", err);
  } else {
    console.log("Connected to the database");
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    const checkProduct = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await db.query(
      "UPDATE products SET name = $1, category = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *",
      [name, category, quantity, price, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { id, name, category, quantity, price } = req.body;
    let result;

    if (id) {
      result = await db.query(
        "UPDATE products SET name = $1, category = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *",
        [name, category, quantity, price, id]
      );
    } else {
      result = await db.query(
        "INSERT INTO products (name, category, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, category, quantity, price]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const checkProduct = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await db.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
