"use client";
import { useState } from "react";
import { featuredProducts } from "../../lib/data";
import type { Product } from "../../lib/types";

const StockManagerAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [availableUnits, setAvailableUnits] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const ADMIN_PASSWORD = "admin123";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      setProducts(featuredProducts);
    } else {
      setError("Invalid password");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setAvailableUnits(product.availableUnits);
    setError("");
  };

  const handleSave = async () => {
    if (availableUnits < 0) {
      setError("Available units cannot be negative");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId ? { ...p, availableUnits } : p
        )
      );

      setEditingProductId(null);
      setError("");
    } catch {
      setError("Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter((p) => p.availableUnits <= 10);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#faf6f1] p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Admin Login
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f1] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPassword("");
            setProducts([]);
            setEditingProductId(null);
            setError("");
          }}
          className="bg-red-600 text-white py-2 px-4 hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mb-6 border border-gray-300 rounded-md px-4 py-2"
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4 mb-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Updating stock...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Low Stock Items
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {lowStockProducts.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Total Available Units
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {products.reduce((sum, p) => sum + p.availableUnits, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Product Inventory ({filteredProducts.length} items)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Available Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {editingProductId === product.id ? (
                      <input
                        type="number"
                        min={0}
                        value={availableUnits}
                        onChange={(e) =>
                          setAvailableUnits(parseInt(e.target.value) || 0)
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span
                        className={`font-medium ${
                          product.availableUnits <= 10
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.availableUnits}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingProductId === product.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="text-green-600 border border-green-300 px-3 py-1 rounded hover:bg-green-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingProductId(null)}
                          className="px-3 py-1 rounded border"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">
            ⚠️ Low Stock Alert
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center bg-white p-4 rounded border border-red-200"
              >
                <div>
                  <div className="text-red-700 font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-bold text-lg">
                    {product.availableUnits}
                  </div>
                  <div className="text-xs text-gray-500">units left</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagerAdmin;
