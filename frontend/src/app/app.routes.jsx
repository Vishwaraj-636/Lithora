import { createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element:<h1>Welcome Home</h1>
  },
  {
      path: "/register",
      element: <Register/>
  },
  {
      path: "/login",
      element: <Login/>
  }
])