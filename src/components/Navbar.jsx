import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { ADMIN, PATHS, USER } from "../constants";
import { toast } from "react-toastify";
import api, { setAuthToken } from "../lib/api";

export default function Navbar() {
  const appName = import.meta.env.VITE_APP_TITLE;

  const navigate = useNavigate();
  const { user, cart, logout, setCart, setCartId, token } = useShop();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  const cartCount = cart.reduce((a, p) => a + p.quantity, 0);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);

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

    user.role == USER && fetchCart();
  }, [token]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <Link to="/home" className="flex items-center gap-3 select-none">
            <span className="text-xl font-black tracking-tight text-blue-600">
              {appName}
            </span>
            <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-md hidden sm:inline">
              Store
            </span>
          </Link>

          <div className="flex items-center gap-5" hidden={!user}>
            <Link
              hidden={user.role !== USER}
              to="/cart"
              className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full shadow-xs animate-fade-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full border border-gray-300 shadow-inner"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Active user profile snapshot"
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2.5 w-48 bg-white border border-gray-200 rounded-xl shadow-md py-1.5 z-20 text-xs font-medium text-gray-700 animate-fade-in">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      hidden={user.role !== ADMIN}
                      to={PATHS.ADMIN_HOME}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3.5 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      My Admin Dashboard
                    </Link>
                    <Link
                      hidden={user.role !== USER}
                      to={PATHS.PROFILE}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3.5 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      My Profile Dashboard
                    </Link>
                    <Link
                      hidden={user.role !== USER}
                      to="/cart"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3.5 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Shopping Cart
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left block px-3.5 py-2 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
