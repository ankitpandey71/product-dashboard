import React from "react";

const ProductForm = ({
  form,
  handleInputChange,
  handleSubmit,
  handleUpdate,
}) => {
  return (
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
  );
};

export default ProductForm;
