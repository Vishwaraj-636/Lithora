import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";
import AppLayout from "./AppLayout";
import PreventSeller from "../features/auth/components/PreventSeller";
import Cart from "../features/cart/pages/Cart";
import OrderSuccess from "../features/cart/pages/OrderSuccess";

export const routes = createBrowserRouter([
   {
      path: "/register",
      element: <Register />,
   },
   {
      path: "/login",
      element: <Login />,
   },
   {
      element: <AppLayout />,
      children: [
         {
            path: "/",
            element: (
               <PreventSeller>
                  <Home />
               </PreventSeller>
            ),
         },
         {
            path: "/product/:productId",
            element: (
               <PreventSeller>
                  <ProductDetail />
               </PreventSeller>
            ),
         },
         {
            path: "/cart",
            element: (
               <Protected role="buyer">
                  <Cart />
               </Protected>
            )
         },
         {
            path: "/order-success/*",
            element: (
               <Protected role="buyer">
                  <OrderSuccess />
               </Protected>
            )
         },
         {
            path: "/seller",
            children: [
               {
                  path: "/seller/create-product",
                  element: (
                     <Protected role="seller">
                        <CreateProduct />
                     </Protected>
                  ),
               },
               {
                  path: "/seller/dashboard",
                  element: (
                     <Protected role="seller">
                        <Dashboard />
                     </Protected>
                  ),
               },
               {
                  path: "/seller/product/:productId",
                  element: (
                     <Protected role="seller">
                        <SellerProductDetail />
                     </Protected>
                  ),
               }
            ],
         },
      ]
   }

]);
