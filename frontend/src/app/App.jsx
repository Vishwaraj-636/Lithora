import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";

function App() {
   const { handleGetMe } = useAuth();
   const user = useSelector((state) => state.auth.user);

   useEffect(() => {
      // Pick up token from Google OAuth redirect (?token=xxx)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");
      if (tokenFromUrl) {
         localStorage.setItem("token", tokenFromUrl);
         // Clean the token out of the URL without a page reload
         window.history.replaceState({}, document.title, window.location.pathname);
      }
      handleGetMe();
   }, []);

   return (
      <>
         <RouterProvider router={routes} />
      </>
   );
}

export default App;
