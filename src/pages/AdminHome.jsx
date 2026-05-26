import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PATHS } from "../constants";

// Core Administrative Master Inventory State Database Mock
const INITIAL_ADMIN_INVENTORY = [
  {
    id: "prod-001",
    name: "Pro Wireless Noise-Cancelling Headphones",
    sku: "NEX-HDP-0042",
    category: "Electronics",
    price: 2499000,
    stock: 14,
    status: "In Stock",
  },
  {
    id: "prod-002",
    name: "Ergonomic Mechanical Gaming Keyboard",
    sku: "NEX-MKB-402",
    category: "Electronics",
    price: 1250000,
    stock: 5,
    status: "Low Stock",
  },
  {
    id: "prod-003",
    name: "Minimalist Canvas Travel Backpack",
    sku: "NEX-BPK-901",
    category: "Apparel",
    price: 680000,
    stock: 45,
    status: "In Stock",
  },
  {
    id: "prod-004",
    name: "Insulated Stainless Steel Water Bottle",
    sku: "NEX-WBT-203",
    category: "Fitness",
    price: 320000,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "prod-005",
    name: "Smart Fitness Tracker & Heart Rate Monitor",
    sku: "NEX-FTR-551",
    category: "Fitness",
    price: 1899000,
    stock: 22,
    status: "In Stock",
  },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const [inventoryList, setInventoryList] = useState(INITIAL_ADMIN_INVENTORY);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // 1. Delete Product Event Handler Row
  const handleDeleteProduct = (id, productName) => {
    if (
      window.confirm(
        `Are you certain you want to remove "${productName}" from the core store inventory listings?`,
      )
    ) {
      setInventoryList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // 2. Incremental Quick-Stock Reorder Event Handler Adjuster
  const handleRestockQuickAdjustment = (id, currentStock) => {
    const updatedStock = currentStock + 10;
    setInventoryList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            stock: updatedStock,
            status: updatedStock > 10 ? "In Stock" : "Low Stock",
          };
        }
        return p;
      }),
    );
  };

  // 3. Computing Live Dashboard Global Operational Metrics
  const metrics = useMemo(() => {
    const activeProductsCount = inventoryList.length;
    const totalStockVolume = inventoryList.reduce((sum, p) => sum + p.stock, 0);
    const outOfStockCount = inventoryList.filter((p) => p.stock === 0).length;
    return { activeProductsCount, totalStockVolume, outOfStockCount };
  }, [inventoryList]);

  // 4. Filtering Table Subsets
  const filteredInventory = useMemo(() => {
    if (categoryFilter === "All") return inventoryList;
    return inventoryList.filter((p) => p.category === categoryFilter);
  }, [categoryFilter, inventoryList]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-12">
      {/* Universal Shared Header Element */}
      <Navbar cartCount={0} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* UPPER CONSOLE BAR: Context indicators & Navigation triggers */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Admin Control Center
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Store Management Console
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(PATHS.ADMIN_CREATE_PRODUCT)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* ANALYTICS SNAPSHOT LAYER: 3-Column Balanced KPI Scorecard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Listed Products
            </p>
            <p className="text-2xl font-black text-gray-900">
              {metrics.activeProductsCount}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Active catalog entries visible online
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Stock Volume
            </p>
            <p className="text-2xl font-black text-gray-900">
              {metrics.totalStockVolume}{" "}
              <span className="text-xs font-normal text-gray-400">units</span>
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Accumulated warehouse items units
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Warehouse Shortages
            </p>
            <p
              className={`text-2xl font-black ${metrics.outOfStockCount > 0 ? "text-red-600" : "text-gray-900"}`}
            >
              {metrics.outOfStockCount}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Products currently marking out of stock
            </p>
          </div>
        </div>

        {/* CORE OPERATIONAL DATA MATRIX PANEL: Filter controls & Data Table Layout */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Table Header Filter Configuration Bar */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Live Inventory Database
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Audit catalog SKUs or apply immediate warehouse inventory
                replenishments
              </p>
            </div>

            {/* Filter Category Select Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wide text-[10px]">
                Filter Scope:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Apparel">Apparel</option>
                <option value="Fitness">Fitness</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4">SKU / Item Identifier</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Retail Unit Price</th>
                  <th className="p-4 text-center">Stock Units</th>
                  <th className="p-4">Status Tag</th>
                  <th className="p-4 text-center">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredInventory.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Column 1: SKU & Name Block */}
                    <td className="p-4 max-w-xs sm:max-w-md">
                      <p className="font-bold text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="font-mono text-[10px] text-gray-400 tracking-tight mt-0.5">
                        {product.sku}
                      </p>
                    </td>

                    {/* Column 2: Category Segment Badge */}
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                        {product.category}
                      </span>
                    </td>

                    {/* Column 3: Localized Currency Cost */}
                    <td className="p-4 text-right font-bold text-gray-900 font-mono">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>

                    {/* Column 4: Warehouse Units */}
                    <td className="p-4 text-center font-bold font-mono">
                      {product.stock}
                    </td>

                    {/* Column 5: Inventory Status Label */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                          product.stock === 0
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : product.stock <= 5
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-green-50 text-green-700 border border-green-100"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Column 6: Administrative Interaction Action Buttons */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleRestockQuickAdjustment(
                              product.id,
                              product.stock,
                            )
                          }
                          className="text-blue-600 hover:text-blue-700 hover:underline font-bold text-[11px]"
                          title="Instantly add 10 units to product inventory"
                        >
                          +10 Stock
                        </button>
                        <span className="text-gray-200">|</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(product.id, product.name)
                          }
                          className="text-red-500 hover:text-red-700 hover:underline font-bold text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conditional Empty Fallback View inside Table Frame */}
          {filteredInventory.length === 0 && (
            <div className="p-8 text-center text-gray-400 border-t border-gray-100">
              No product files listed matching the active category filter query
              criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
