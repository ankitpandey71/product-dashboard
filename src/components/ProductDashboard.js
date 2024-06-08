import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

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
      await axios.post("http://localhost:4000/products", form);
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
      <ProductForm
        form={form}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdate}
      />
      <ProductTable
        products={products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ProductDashboard;
