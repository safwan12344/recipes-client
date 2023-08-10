import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Login from "../pages/login/Login";
import SignUp from "../pages/sign up/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default router;
