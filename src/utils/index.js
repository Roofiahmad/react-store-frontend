export const STORAGE_KEYS = {
  user: "shop_user",
  token: "shop_token",
  cart: "shop_cart",
  session: "shop_session",
};

export const getStoredJson = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  const storage =
    key === STORAGE_KEYS.session ? window.sessionStorage : window.localStorage;
  const stored = storage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

export const decodeJwt = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch {
    return null;
  }
};
