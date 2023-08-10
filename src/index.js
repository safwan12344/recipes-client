import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import UserContext, { USER } from "./context/UserContext";
import AuthContext, { TOKEN } from "./context/AuthContext";

const Root = () => {
  const [user, setUser] = useState(USER);
  const [token, setToken] = useState(TOKEN);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    const tokenFromLocalStorage = localStorage.getItem("token");
    if (userFromLocalStorage && tokenFromLocalStorage) {
      setUser(userFromLocalStorage);
      setToken(tokenFromLocalStorage);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AuthContext.Provider value={{ token, setToken }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </UserContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
