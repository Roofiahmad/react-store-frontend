import {
  ADMIN_ITEMS_PER_PAGE,
  ALL_CATEGORY,
  ALL_CATEGORY_ID,
} from "../../constants";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";

const ProductPanel = () => {
  const [productPage, setProductPage] = useState(1);
  const [adminProducts, setAdminProducts] = useState([]);
  const [pageMeta, setPageMeta] = useState({
    currentPage: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORY_ID);

  const generateStockStatus = (stock) => {
    if (stock == 0) return "OUT OF STOCK";
    if (stock <= 5) return "LOW STOCK";
    return "IN STOCK";
  };

  const handleSelectCategory = (id) => {
    setSelectedCategoryId(() => id);
    setProductPage(() => 1);
  };

  const handleRestockQuickAdjustment = async (productId, updatedStock) => {
    try {
      const response = await api.put(`/products/${productId}`, {
        stock: updatedStock,
      });
      if (response.data.success) {
        toast.success("successfully update product stock");
        getProducts();
      }
    } catch (error) {
      toast.error(`Failed to update product stock: ${error.response.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      if (response.status == 204) {
        toast.success("successfully delete product");
        getProducts();
      }
    } catch (error) {
      toast.error(`Failed to delete product : ${error.response.message}`);
    }
  };

  const getProducts = async () => {
    const catId = selectedCategoryId != 0 ? selectedCategoryId : "";
    try {
      const response = await api.get(
        `admin/products?size=${ADMIN_ITEMS_PER_PAGE}&page=${productPage - 1}&sort=createdAt&categoryId=${catId}`,
      );
      if (response.data.success) {
        const { content, meta } = response.data.data;
        setAdminProducts(content);
        setPageMeta(meta);
      }
    } catch (error) {
      toast.error(`Failed to fetch admin products: ${error.response.message}`);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getProducts();
  }, [productPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getProducts();
  }, [selectedCategoryId]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get(`category`);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        toast.error(`Failed to fetch category: ${error.response.message}`);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs animate-fade-in space-y-2">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Live Inventory Database
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Audit catalog SKUs or apply warehouse modifications
          </p>
        </div>
        <select
          value={selectedCategoryId}
          onChange={(e) => handleSelectCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 font-semibold text-gray-700 text-xs focus:outline-none"
        >
          <option id={ALL_CATEGORY_ID} value={ALL_CATEGORY_ID}>
            {ALL_CATEGORY}
          </option>
          {categories.map((c) => (
            <option value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-bold uppercase tracking-wider">
              <th className="p-4">SKU / Item Identifier</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Retail Price</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {adminProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50/60 transition-colors"
              >
                <td className="p-4">
                  <p className="font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 tracking-tight mt-0.5">
                    {product.sku}
                  </p>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                    {product.categoryName}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-gray-900 font-mono">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-center font-bold font-mono">
                  {product.stock}
                </td>
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
                    {generateStockStatus(product.stock)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2.5 font-bold text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        handleRestockQuickAdjustment(
                          product.id,
                          product.stock + 10,
                        )
                      }
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      +10 Stock
                    </button>
                    <span className="text-gray-200 font-normal">|</span>
                    {/* <button
                      type="button"
                      onClick={() =>
                        navigate(`${PATHS.ADMIN_EDIT_PRODUCT}/${product.id}`)
                      }
                      className="text-amber-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button> */}
                    <span className="text-gray-200 font-normal">|</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:underline cursor-pointer"
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

      {/* 📑 INVENTORY PACKAGED FOOTER PAGINATION CONTROL SLAT */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
        <p>
          Showing Page {pageMeta.currentPage + 1} of {pageMeta.totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={pageMeta.currentPage + 1 === 1}
            onClick={() => setProductPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none"
          >
            ◀ Previous
          </button>
          <button
            disabled={productPage === pageMeta.totalPages}
            onClick={() => setProductPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPanel;
