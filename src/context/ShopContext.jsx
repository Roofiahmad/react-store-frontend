import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../lib/api";
import { getStoredJson, STORAGE_KEYS } from "../utils";
import { toast } from "react-toastify";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [user, setUser] = useState(() =>
    getStoredJson(STORAGE_KEYS.user, null),
  );
  const [token, setToken] = useState(() =>
    window.sessionStorage.getItem(STORAGE_KEYS.token),
  );
  const [cart, setCart] = useState(() => getStoredJson(STORAGE_KEYS.cart, []));
  const [cartId, setCartId] = useState(null);

  const login = ({ user: newUser, token: newToken }) => {
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    window.sessionStorage.clear();
    window.localStorage.clear();
  };

  const addToCart = async (product) => {
    try {
      const response = await api.post(`/carts/${cartId}/items`, {
        productId: product.id,
      });

      if (response.data.success) {
        setCart((currentCart) => {
          const existing = currentCart.find((item) => item.id === product.id);
          if (existing) {
            return currentCart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }
          return [...currentCart, { ...product, quantity: 1 }];
        });
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Error add cart item");
      }
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/carts/${cartId}/items/${productId}`, {
        productId: productId,
      });

      if (response.data.success) {
        setCart((currentCart) =>
          currentCart.filter((item) => item.id !== productId),
        );
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Error remove cart item");
      }
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (quantity == 0) return removeFromCart(productId);
    try {
      const response = await api.put(`/carts/${cartId}/items/${productId}`, {
        quantity: quantity,
      });

      if (response.data.success) {
        setCart((currentCart) =>
          currentCart
            .map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            )
            .filter((item) => item.quantity > 0),
        );
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Error update cart item");
      }
    }
  };

  const clearCart = async (successCb) => {
    try {
      const response = await api.delete(`/carts/${cartId}/items`, {});
      if (response.data.success) {
        setCart([]);
        successCb && successCb();
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Error clear cart items");
      }
    }
  };

  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      window.sessionStorage.setItem(STORAGE_KEYS.token, token);
      setAuthToken(token);
    } else {
      window.sessionStorage.removeItem(STORAGE_KEYS.token);
      setAuthToken(null);
    }
  }, [token]);

  useEffect(() => {
    if (cart.length > 0) {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.cart);
    }
  }, [cart]);

  const value = useMemo(
    () => ({
      user,
      token,
      cart,
      isAuthenticated,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      setCart,
      setCartId,
    }),
    [user, token, cart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
