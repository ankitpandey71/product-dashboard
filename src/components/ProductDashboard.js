import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
  });

  useEffect(() => {
    fetchProducts();

    socket.on("productAdded", (product) => {
      setProducts((prevProducts) => [...prevProducts, product]);
    });

    socket.on("productUpdated", (updatedProduct) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    });

    socket.on("productDeleted", ({ id }) => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:4000/products");
    setProducts(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name && form.description && form.price && form.stock_quantity) {
      const response = await axios.post("http://localhost:4000/products", form);
      setForm({ name: "", description: "", price: "", stock_quantity: "" });
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/products/${id}`);
  };

  const handleEdit = async (id) => {
    const product = products.find((p) => p.id === id);
    setForm(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, name, description, price, stock_quantity } = form;
    await axios.put(`http://localhost:4000/products/${id}`, {
      name,
      description,
      price,
      stock_quantity,
    });
    setForm({ name: "", description: "", price: "", stock_quantity: "" });
  };

  return (
    <div>
      <h1>Product Dashboard</h1>
      <form onSubmit={form.id ? handleUpdate : handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleInputChange}
          required
        />
        <input
          name="stock_quantity"
          placeholder="Stock Quantity"
          type="number"
          value={form.stock_quantity}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{form.id ? "Update" : "Add"}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock_quantity}</td>
              <td>
                <button onClick={() => handleEdit(product.id)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDashboard;
