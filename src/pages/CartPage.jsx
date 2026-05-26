import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { PATHS, PPN_PERCENTAGE, SHIPPING_FEE } from "../constants";
import { useEffect } from "react";
import { toast } from "react-toastify";
import api, { setAuthToken } from "../lib/api";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, token, setCart, setCartId } =
    useShop();

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 0 ? SHIPPING_FEE : 0;
  const estimatedTax = Math.round(subtotal * PPN_PERCENTAGE);
  const grandTotal = subtotal + shippingFee + estimatedTax;

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await api.get("/carts");

        if (response.data.success) {
          const { items, id } = response.data.data;
          setCart(items);
          setCartId(id);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve cart items");
        }
      }
    };

    setAuthToken(token);
    fetchCart();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Your Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your items before advancing to secure checkout gateway
            </p>
          </div>
          <button
            onClick={() => navigate(PATHS.HOME)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-4 py-2 rounded-lg transition-all"
          >
            ← Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="text-gray-300 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-16 h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Your basket is feeling light
            </h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Looks like you haven't committed any marketplace items to your
              shopping cart layout yet.
            </p>
            <button
              onClick={() => navigate(PATHS.HOME)}
              className="bg-blue-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors inline-block"
            >
              Discover Hot Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-4 items-center flex-grow">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5 max-w-xs md:max-w-md">
                      <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-gray-900">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartItem(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-800 select-none bg-white min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartItem(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-28">
                      <p className="text-sm font-black text-gray-900">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-red-500 font-medium hover:underline tracking-tight mt-0.5"
                      >
                        Remove item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Price Summary
                </h2>

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Total items ({totalItemsCount} units)</span>
                    <span className="font-medium text-gray-900">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping/Handling</span>
                    <span className="font-medium text-gray-900">
                      Rp {shippingFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value Added Tax (PPN 11%)</span>
                    <span className="font-medium text-gray-900">
                      Rp {estimatedTax.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
                    <span>Estimated Total</span>
                    <span className="text-blue-600 text-base">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate(PATHS.CHECKOUT)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors text-center shadow-xs block"
                  >
                    Proceed To Checkout
                  </button>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-[11px] text-gray-500 leading-relaxed text-center">
                  Items are not reserved until checkout clearance parameters are
                  successfully authorized.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
