export const PATHS = {
  // Public / Customer Paths
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  PRODUCT_DETAILS: "/product-details",
  SEARCH_RESULTS: "/search-results",

  // User Route
  CART: "/cart",
  CHECKOUT: "/checkout",
  PROFILE: "/profile",
  ORDER_DETAILS: "/order-details",
  ORDER_SUCCESS: "/order-success",
  ORDER_CANCEL: "/order-cancel",

  // Admin Paths
  ADMIN_HOME: "/admin-home",
  ADMIN_CREATE_PRODUCT: "/create-product",
};

export const PPN_PERCENTAGE = 0.11;
export const SHIPPING_FEE = 45000;

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

export const ALL_CATEGORY = "All";
export const ALL_CATEGORY_ID = 0;

export const SORT_BY = [
  {
    label: "Created: Newest to Oldest",
    value: "LATEST",
  },
  {
    label: "Created: Oldest to Newest",
    value: "OLDEST",
  },
  {
    label: "Price: Low to High",
    value: "PRICE_LOW_TO_HIGH",
  },
  {
    label: "Price: High to Low",
    value: "PRICE_HIGH_TO_LOW",
  },
  {
    label: "Stock: High to Low",
    value: "HIGHEST_STOCK",
  },
  {
    label: "Stock: Low to High",
    value: "LOWEST_STOCK",
  },
];

export const SCROLL_TOP_BEHAVIOR = {
  top: 0,
  left: 0,
  behavior: "smooth",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  PROCESSED: "PROCESSED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
};

export const ORDER_STEP = {
  [ORDER_STATUS.PENDING]: 1,
  [ORDER_STATUS.PAID]: 2,
  [ORDER_STATUS.PROCESSED]: 3,
  [ORDER_STATUS.SHIPPED]: 4,
  [ORDER_STATUS.DELIVERED]: 5,
};

export const CUSTOMER_ORDER_STATUS_INFO = {
  PENDING: "Awaiting Secure Payment",
  PAID: "Payment Verified! You're Locked In 🚀",
  PROCESSED: "Our Team is Prepping Your Pack 📦",
  SHIPPED: "Handed Off to Our Trusted Courier 🚚",
  DELIVERED: "Delivered! Enjoy Your New Gear 🎉",
};

export const ADMIN_ORDER_STATUS_INFO = {
  PENDING: "Awaiting Secure Payment ⏳",
  PAID: "Payment Verified! Locked In 🚀",
  PROCESSED: "Prepping Pack inside Warehouse 📦",
  SHIPPED: "Dispatched with Trusted Courier 🚚",
  DELIVERED: "Delivered • Goods Received 🎉",
};
