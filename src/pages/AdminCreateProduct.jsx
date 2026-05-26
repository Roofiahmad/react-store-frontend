import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import { BADGE_COLORS, BADGES, PATHS } from "../constants";
import { toast } from "react-toastify";
import api from "../lib/api";
import Button from "../components/Button";

export default function AdminCreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      category: "1",
      price: "",
      stock: "",
      badge: "NONE",
      description: "",
      uploadedImages: [],
    },
  });

  const selectedBadge = watch("badge");
  const remoteImageUrls = watch("uploadedImages") || [];

  const handleFileChange = async (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    setIsUploading(true);
    const uploadedPaths = [...remoteImageUrls];

    try {
      for (const file of rawFiles) {
        const uploadPayload = new FormData();
        uploadPayload.append("file", file);

        const response = await api.post("/files/upload", uploadPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status == 200) {
          const filePath = response.data.url;
          uploadedPaths.push(filePath);
        }
      }

      setValue("uploadedImages", uploadedPaths);
      toast.success("Successfully upload product image!");
    } catch (err) {
      console.error("Asset tracking pipeline failure:", err);
      toast.error("Failed to upload assets to processing endpoint.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data) => {
    if (data.uploadedImages.length === 0) {
      toast.warn("Please upload at least one image asset.");
      return;
    }

    const productPayload = {
      name: data.name.trim(),
      sku: data.sku.toUpperCase().trim(),
      categoryId: Number(data.category),
      price: Number(data.price),
      stock: Number(data.stock),
      badge: data.badge,
      description: data.description,
      mainImage: data.uploadedImages[0],
      gallery: data.uploadedImages.map((url) => ({ url: url })),
    };

    setLoading(true);

    api
      .post("/products", productPayload)
      .then((res) => {
        if (res.status == 201) {
          toast.success("Product created successfully!");
          navigate(PATHS.ADMIN_HOME);
        }
      })
      .catch((err) => {
        toast.error(`Failed to commit product: ${err.response.message}`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCategoryList() {
      try {
        const response = await api.get("/category", {
          signal: controller.signal,
        });
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve category list");
        }
      }
    }

    fetchCategoryList();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-12">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 mb-6 border-b border-gray-200 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Administrative Console
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              Publish New Product
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate(PATHS.ADMIN_HOME)}
            className="text-xs font-bold text-gray-600 hover:text-blue-600 bg-white border border-gray-200 shadow-xs px-4 py-2 rounded-lg transition-all"
          >
            Cancel Actions
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
        >
          {Object.keys(errors).length > 0 && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100">
              ⚠️ Please correct validation field parameters marked below.
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5">
              1. Base Identity Metrics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-600 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Product title is required",
                  })}
                  className={`w-full text-sm border rounded-lg p-2.5 focus:outline-none ${errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="e.g., Ultra-Thin Mechanical Desktop Keyboard"
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  SKU Code *
                </label>
                <input
                  type="text"
                  {...register("sku", {
                    required: "SKU configuration is required",
                  })}
                  className={`w-full text-sm border rounded-lg p-2.5 font-mono uppercase focus:outline-none ${errors.sku ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="NEX-MKB-402"
                />
                {errors.sku && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.sku.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Target Category Assignment
                </label>
                <select
                  {...register("category")}
                  className="w-full text-sm bg-white border border-gray-300 rounded-lg p-2.5 font-semibold text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Retail Price (IDR / Rupiah) *
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Retail price value is mandatory",
                    min: {
                      value: 1,
                      message: "Price tag must be greater than zero",
                    },
                  })}
                  className={`w-full text-sm border rounded-lg p-2.5 focus:outline-none ${errors.price ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="e.g., 1250000"
                />
                {errors.price && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Available Stock Metrics *
                </label>
                <input
                  type="number"
                  {...register("stock", {
                    required: "Stock value parameters are required",
                    min: {
                      value: 0,
                      message: "Warehouse stock metrics cannot be negative",
                    },
                  })}
                  className={`w-full text-sm border rounded-lg p-2.5 focus:outline-none ${errors.stock ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="e.g., 24"
                />
                {errors.stock && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="badge"
                    className="text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Product Status Badge
                  </label>
                  {selectedBadge !== "NONE" && (
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-md transition-all ${BADGE_COLORS[selectedBadge]}`}
                    >
                      {selectedBadge?.replace("_", " ")}
                    </span>
                  )}
                </div>
                <select
                  id="badge"
                  {...register("badge")}
                  className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
                >
                  {BADGES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* BLOCK SECTION 2: DESCRIPTION */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5">
              2. Marketplace Description
            </h2>
            <div className="text-xs">
              <label className="block font-bold text-gray-600 mb-1">
                Item Description Text *
              </label>
              <textarea
                rows="4"
                {...register("description", {
                  required:
                    "Marketplace description field text context is missing",
                })}
                className={`w-full text-sm border rounded-lg p-2.5 focus:outline-none leading-relaxed ${errors.description ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                placeholder="Elaborate functional specs details, warrant definitions..."
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] mt-1 font-semibold">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* BLOCK SECTION 3: MEDIA ASSETS ASSIGNMENT & BACKGROUND UPLOAD */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5">
              3. Media Assets & Gallery
            </h2>

            <div className="text-xs pt-2">
              <label className="block font-bold text-gray-600 mb-1">
                Product Image Repository Uploads *
              </label>

              <div
                className={`border-2 border-dashed rounded-xl p-6 transition-all bg-gray-50/50 flex flex-col items-center justify-center relative group ${isUploading ? "border-blue-400 bg-blue-50/10 cursor-not-allowed" : "border-gray-200 hover:border-blue-500 cursor-pointer"}`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 disabled:cursor-not-allowed"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="font-bold text-blue-600 text-[11px]">
                      Uploading files to /files/upload...
                    </span>
                  </div>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mb-1 transition-colors"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="font-bold text-gray-500 text-[11px] group-hover:text-blue-600 transition-colors">
                      Select files to upload directly
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      The first image will become the main cover asset
                      automatically
                    </span>
                  </>
                )}
              </div>

              {/* 📸 Remote Active Storage Queued Path Indicators */}
              {remoteImageUrls.length > 0 && (
                <div className="mt-4 space-y-1.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                    Verified Server Asset Tracks ({remoteImageUrls.length})
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                    {remoteImageUrls.map((path, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-2xs"
                      >
                        <span className="font-medium text-gray-600 truncate max-w-[75%] font-mono">
                          {idx === 0 ? "👑 [MAIN COVER] " : "📸 [GALLERY] "}{" "}
                          {path}
                        </span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 font-bold px-1"
                          onClick={() => {
                            // Easily remove broken paths out of state if the admin changes their mind
                            const updatedPaths = remoteImageUrls.filter(
                              (_, i) => i !== idx,
                            );
                            setValue("uploadedImages", updatedPaths);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CONTROL INTERACTION FOOTER SUMMARY ACTIONS */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              disabled={isLoading || isUploading}
              onClick={() => navigate(PATHS.ADMIN_HOME)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Discard Changes
            </button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2 disabled:bg-gray-400"
              text="Add Product"
              loadingText="Syncing Database..."
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || isUploading}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
