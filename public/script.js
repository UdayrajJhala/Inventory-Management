document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addProductForm");
  const productTableBody = document.getElementById("productTableBody");
  let editMode = false;
  let editProductId = null;

  fetchProducts();

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

    if (editMode) {
      await fetch(`/api/products/${editProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, quantity, price }),
      });
      editMode = false;
      editProductId = null;
      document.getElementById("submitBtn").textContent = "Add Product";
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, quantity, price }),
      });
    }

    form.reset();
    fetchProducts();
  });

  async function fetchProducts() {
    const response = await fetch("/api/products");
    const products = await response.json();
    renderProducts(products);
  }

  function renderProducts(products) {
    productTableBody.innerHTML = "";
    products.forEach((product) => {
      const price = product.price ? Number(product.price).toFixed(2) : "0.00";
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category || ""}</td>
            <td>${product.quantity}</td>
            <td>$${price}</td>
            <td class="actions">
                <button onclick="editProduct(${product.id}, '${
        product.name
      }', '${product.category}', ${product.quantity}, ${price})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
      productTableBody.appendChild(row);
    });
  }

  window.editProduct = function (id, name, category, quantity, price) {
    document.getElementById("name").value = name;
    document.getElementById("category").value = category;
    document.getElementById("quantity").value = quantity;
    document.getElementById("price").value = price;

    editMode = true;
    editProductId = id;
    document.getElementById("submitBtn").textContent = "Update Product";
  };

  window.deleteProduct = async function (id) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };
});
