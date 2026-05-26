import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ADMIN, PATHS, USER } from "../constants";
import ProtectedRoute from "./ProtectedRoute"; //
import { useShop } from "../context/ShopContext";

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
  { path: PATHS.HOME, element: <HomePage /> },
  { path: PATHS.REGISTER, element: <RegisterPage /> },
  { path: PATHS.PRODUCT_DETAILS, element: <ProductDetailsPage /> },
  { path: PATHS.CART, element: <CartPage /> },
  { path: PATHS.SEARCH_RESULTS, element: <SearchResults /> },

  {
    element: <ProtectedRoute allowedRoles={[USER]} user={currentUser} />,
    children: [
      { path: PATHS.CHECKOUT, element: <CheckoutPage /> },
      { path: PATHS.PROFILE, element: <ProfilePage /> },
      { path: PATHS.ORDER_DETAILS, element: <OrderDetailsPage /> },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[ADMIN]} user={currentUser} />,
    children: [
      { path: PATHS.ADMIN_HOME, element: <AdminHome /> },
      { path: PATHS.ADMIN_CREATE_PRODUCT, element: <AdminCreateProduct /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];

const RouteWrapper = () => {
  const { user } = useShop();
  const router = createBrowserRouter(createRoutes(user));

  return <RouterProvider router={router} />;
};

export default RouteWrapper;
