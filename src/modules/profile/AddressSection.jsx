import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../lib/api";

export default function AddressSection() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      isPrimary: false,
    },
  });
  const fetchAddresses = async (signal) => {
    try {
      setIsLoading(true);
      const response = await api.get("/address", { signal });
      if (response.data.success) {
        setAddresses(response.data.data || []);
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to load registered addresses.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAddresses(controller.signal);
    return () => controller.abort();
  }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    reset({
      label: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      isPrimary: addresses.length === 0, // Default to true if this is their first address
    });
    setIsAddressModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    reset({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isPrimary: addr.isPrimary,
    });
    setIsAddressModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (editingAddress) {
        const response = await api.put(`/address/${editingAddress.id}`, data);
        if (response.data.success) {
          toast.success("Address updated successfully.");
        }
      } else {
        const response = await api.post("/address", data);
        if (response.data.success) {
          toast.success("New shipping destination registered!");
        }
      }

      setIsAddressModalOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address changes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to purge this address track?"))
      return;

    try {
      setIsLoading(true);
      const response = await api.delete(`/address/${addressId}`);
      if (response.data.success) {
        toast.warn("Shipping track purged permanently.");
        fetchAddresses();
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not complete address deletion request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4 relative">
        {isLoading && !isAddressModalOpen && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
            <span className="text-xs font-bold text-gray-500 animate-pulse">
              Syncing logistics data...
            </span>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
              Registered Shipping Address
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">
              Manage corporate supply rails and home addresses.
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={openAddModal}
            className="bg-gray-900 hover:bg-blue-600 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors shadow-2xs disabled:bg-gray-400"
          >
            + Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <p className="text-xs text-gray-400 italic">
              No delivery locations linked to this account registry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs flex flex-col justify-between hover:border-gray-300 transition-colors group animate-fade-in"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-gray-800 capitalize tracking-tight flex items-center gap-1.5">
                      📍 {addr.label}
                    </span>
                    {addr.isPrimary && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-md">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 font-medium pt-1 font-sans leading-relaxed">
                    {addr.street}
                  </p>
                  <p className="text-gray-400 text-[11px] tracking-tight">
                    {addr.city}, {addr.state} • {addr.zip}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-3 mt-2 border-t border-gray-200/60 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => openEditModal(addr)}
                    className="text-[11px] font-bold text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Modify
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={(e) => handleDeleteAddress(addr.id, e)}
                    className="text-[11px] font-bold text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Delete Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                {editingAddress
                  ? "⚙️ Modify Distribution Track"
                  : "➕ Register New Shipping Destination"}
              </h4>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Location Alias Label *
                </label>
                <input
                  type="text"
                  {...register("label", {
                    required: "Alias description is required",
                  })}
                  className={`w-full border rounded-lg p-2.5 focus:outline-none ${errors.label ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="e.g., Main Office, Apartment Suite, Home"
                />
                {errors.label && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.label.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Street Address Details *
                </label>
                <input
                  type="text"
                  {...register("street", {
                    required: "Street coordinates are mandatory",
                  })}
                  className={`w-full border rounded-lg p-2.5 focus:outline-none ${errors.street ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="Street names, buildings, unit parameters..."
                />
                {errors.street && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">
                    City / Region *
                  </label>
                  <input
                    type="text"
                    {...register("city", {
                      required: "City input is required",
                    })}
                    className={`w-full border rounded-lg p-2.5 focus:outline-none ${errors.city ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    placeholder="e.g., Tulungagung"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">
                    Province / State *
                  </label>
                  <input
                    type="text"
                    {...register("state", {
                      required: "state state assignment is required",
                    })}
                    className={`w-full border rounded-lg p-2.5 focus:outline-none ${errors.state ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    placeholder="e.g., East Java"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Postal Code (ZIP) *
                </label>
                <input
                  type="text"
                  {...register("zip", {
                    required: "Postal routing code is missing",
                  })}
                  className={`w-full border rounded-lg p-2.5 font-mono focus:outline-none ${errors.zip ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="e.g., 66212"
                />
                {errors.zip && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.zip.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 select-none">
                <input
                  type="checkbox"
                  id="modalPrimaryCheckbox"
                  {...register("isPrimary")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="modalPrimaryCheckbox"
                  className="font-bold text-gray-600 cursor-pointer"
                >
                  Set as primary baseline distribution route
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsAddressModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition-colors shadow-xs disabled:bg-gray-400 flex items-center gap-1.5"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
