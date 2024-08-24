import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    const result = await db.query(
      "INSERT INTO products (name, category, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, category, quantity, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    const result = await db.query(
      "UPDATE products SET name = $1, category = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *",
      [name, category, quantity, price, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.send("Product deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
