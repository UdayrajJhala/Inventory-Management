// src/components/ProductForm.js
import React, { useState, useEffect } from "react";

const ProductForm = ({ onSubmit, editMode, editProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (editMode && editProduct) {
      setFormData(editProduct);
    }
  }, [editMode, editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editMode);
    setFormData({ name: "", category: "", quantity: "", price: "" });
  };

  return (
    <section id="product-form">
      <h2>{editMode ? "Edit" : "Add"} Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editMode ? "Update" : "Add"} Product</button>
      </form>
    </section>
  );
};

export default ProductForm;
