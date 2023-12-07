import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Router from "./components/router/Router"
import history from "./components/router/history";
import axios from "./utils/axios";
import { useSnapshot } from "valtio";
import categoriesState from "./states/categories";
import Error from "./components/error/Error";
import errorState from "./states/error";

const Root = () => {
  const categoriesSnap = useSnapshot(categoriesState);

  const errorSnap = useSnapshot(errorState);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
      categoriesSnap.setCategories(response.data);
      errorSnap.setError(null);
    };

    getCategories().catch((error) => {
      if (error.toJSON().message === "Network Error") {
        errorSnap.setError("Server is unavailable please try later");
      } else {
        errorSnap.setError(
          error.response.data?.message || "Server is unavailable please try later",
        );
      }
    });
  }, []);

  return (
    // <Layout>
    <>
      <Error />
      <Router history={history}>
        <Routes>
          <Route path='/*' element={<Layout />} />
        </Routes>
      </Router>
    </>
    // </Layout>
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
