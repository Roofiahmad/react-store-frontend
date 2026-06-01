import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PATHS } from "../constants";
import ProductPanel from "../modules/admin/ProductPanel";
import OrderPanel from "../modules/admin/OrderPanel";
import api from "../lib/api";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function AdminHome() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("PRODUCTS");

  const [isLoading, setLoading] = useState(false);

  const [adminStatistics, setAdminStatistics] = useState({
    listedProducts: 0,
    orderPendingFulfillment: [],
    productShortages: [],
    totalStockVolume: 0,
  });

  const getStatistics = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/statistics");
      if (response.data.success) {
        setAdminStatistics(response.data.data);
      }
    } catch (error) {
      toast.error(`Failed to fetch statistics: ${error.response.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-12">
      {isLoading && <LoadingSpinner />}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* UPPER CONSOLE BAR */}
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

        {/* ANALYTICS SNAPSHOT LAYER */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Listed Products
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {adminStatistics.listedProducts}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Stock Volume
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {adminStatistics.totalStockVolume}{" "}
              <span className="text-xs font-normal text-gray-400">units</span>
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Catalog Shortages
            </p>
            <p
              className={`text-2xl font-black mt-1 ${adminStatistics.productShortages.length > 0 ? "text-red-600" : "text-gray-900"}`}
            >
              {adminStatistics.productShortages.length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs border-l-4 border-l-blue-500">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Pending Fulfillment
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {adminStatistics.orderPendingFulfillment.length}
            </p>
          </div>
        </div>

        {/* PANEL SWITCHER TABS */}
        <div className="flex border-b border-gray-200 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActivePanel("PRODUCTS")}
            className={`px-6 py-3.5 border-b-2 transition-all cursor-pointer ${activePanel === "PRODUCTS" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            📦 Product Inventory
          </button>
          <button
            onClick={() => setActivePanel("ORDERS")}
            className={`px-6 py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activePanel === "ORDERS" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            📋 Order Management
          </button>
        </div>

        {activePanel === "PRODUCTS" ? <ProductPanel /> : <OrderPanel />}
      </main>
    </div>
  );
}
