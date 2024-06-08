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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      await axios.delete(`http://localhost:4000/products/${id}`);
    }
  };

  const handleEdit = async (id) => {
    const confirmEdit = window.confirm(
      "Are you sure you want to edit this product?"
    );
    if (confirmEdit) {
      const product = products.find((p) => p.id === id);
      setForm(product);
    }
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product Dashboard</h1>
      <form
        onSubmit={form.id ? handleUpdate : handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <input
            name="stock_quantity"
            placeholder="Stock Quantity"
            type="number"
            value={form.stock_quantity}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {form.id ? "Update" : "Add"}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Name</th>
            <th className="py-2">Description</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock Quantity</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="py-2 px-4">{product.id}</td>
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.description}</td>
              <td className="py-2 px-4">{product.price}</td>
              <td className="py-2 px-4">{product.stock_quantity}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDashboard;
