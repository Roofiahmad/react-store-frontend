import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ADMIN, PATHS, USER } from "../constants";
import ProtectedRoute from "./ProtectedRoute";
import { useShop } from "../context/ShopContext";
import RootLayout from "./RootLayout";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import OrderCancelPage from "../pages/OrderCancelPage";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ProductDetailsPage = lazy(() => import("../pages/ProductDetailsPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const SearchResults = lazy(() => import("../pages/SearchResults"));
const AdminHome = lazy(() => import("../pages/AdminHome"));
const AdminCreateProduct = lazy(() => import("../pages/AdminCreateProduct"));
const NotFound = lazy(() => import("../pages/NotFoundPage"));

const createRoutes = (currentUser) => [
  { path: PATHS.LOGIN, element: <LoginPage /> },
  { path: PATHS.REGISTER, element: <RegisterPage /> },

  {
    path: "/",
    element: <RootLayout />,
    children: [
      // PUBLIC ROUTES
      { path: PATHS.HOME, element: <HomePage /> },
      { path: PATHS.PRODUCT_DETAILS, element: <ProductDetailsPage /> },
      { path: PATHS.CART, element: <CartPage /> },
      { path: PATHS.SEARCH_RESULTS, element: <SearchResults /> },

      // 🔐 PROTECTED USER ROUTES
      {
        element: <ProtectedRoute allowedRoles={[USER]} user={currentUser} />,
        children: [
          { path: PATHS.CHECKOUT, element: <CheckoutPage /> },
          { path: PATHS.PROFILE, element: <ProfilePage /> },
          { path: PATHS.ORDER_DETAILS, element: <OrderDetailsPage /> },
          { path: PATHS.ORDER_SUCCESS, element: <OrderSuccessPage /> },
          { path: PATHS.ORDER_CANCEL, element: <OrderCancelPage /> },
        ],
      },

      // 🔐 PROTECTED ADMIN ROUTES
      {
        element: <ProtectedRoute allowedRoles={[ADMIN]} user={currentUser} />,
        children: [
          { path: PATHS.ADMIN_HOME, element: <AdminHome /> },
          { path: PATHS.ADMIN_CREATE_PRODUCT, element: <AdminCreateProduct /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
];

const RouteWrapper = () => {
  const { user } = useShop();

  const router = createBrowserRouter(createRoutes(user), {
    basename: "/",
  });

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing application modules...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default RouteWrapper;
