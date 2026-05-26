export const PATHS = {
  // Public / Customer Paths
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/home",
  PRODUCT_DETAILS: "/product-details",
  SEARCH_RESULTS: "/search-results",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PROFILE: "/profile",
  ORDER_DETAILS: "/order-details",

  // Admin Paths
  ADMIN_HOME: "/admin-home",
  ADMIN_CREATE_PRODUCT: "/create-product",
};

export const PPN_PERCENTAGE = 0.11;
export const SHIPPING_FEE = 35;

export const USER = "USER";
export const ADMIN = "ADMIN";

export const BADGE_NONE = "NONE";
export const BADGE_NEW_ARRIVAL = "NEW_ARRIVAL";
export const BADGE_BEST_SELLER = "BEST_SELLER";
export const BADGE_SALE = "SALE";
export const BADGE_LIMITED = "LIMITED";

export const BADGES = [
  { value: BADGE_NONE, label: "Standard Listing (No Badge)" },
  { value: BADGE_NEW_ARRIVAL, label: "✨ New Arrival" },
  { value: BADGE_BEST_SELLER, label: "🔥 Best Seller" },
  { value: BADGE_SALE, label: "🏷️ Special Sale Discount" },
  { value: BADGE_LIMITED, label: "⏳ Limited Edition Batch" },
];

export const BADGE_COLORS = {
  [BADGE_NONE]: "!bg-gray-100 text-gray-600",
  [BADGE_NEW_ARRIVAL]: "!bg-teal-100 text-teal-800 border-teal-200",
  [BADGE_BEST_SELLER]: "!bg-amber-100 text-amber-800 border-amber-200",
  [BADGE_SALE]: "!bg-rose-100 text-rose-800 border-rose-200",
  [BADGE_LIMITED]: "!bg-purple-100 text-purple-800 border-purple-200",
};
