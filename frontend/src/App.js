import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products"); 
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (formData, isEdit) => {
    const url = isEdit
      ? `http://localhost:5000/api/products/${editProduct.id}` 
      : "http://localhost:5000/api/products"; 
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save the product");
      }

      fetchProducts();
      setEditMode(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditProduct(product);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container">
      <Header />
      <ProductForm
        onSubmit={handleSubmit}
        editMode={editMode}
        editProduct={editProduct}
      />
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
