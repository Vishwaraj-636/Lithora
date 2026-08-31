import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PreventSeller = ({ children }) => {
   const user = useSelector((state) => state.auth.user);
   const loading = useSelector((state) => state.auth.loading);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (user && user.role === "seller") {
      return <Navigate to="/seller/dashboard" replace />;
   }

   return children;
};

export default PreventSeller;
