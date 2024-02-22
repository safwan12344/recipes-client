import { Route, Routes } from "react-router-dom";
import Header from "../header/Header";
// import PropTypes from "prop-types";
import App from "../../App";
import Login from "../../pages/login/Login";
import SignUp from "../../pages/sign up/SignUp";
import CategoryRecipes from "../../pages/category/CategoryRecipes";
import ProtectedRoute from "../protected-route/ProtectedRoute";
import NewRecipe from "../../pages/recipes/NewRecipe";
import MyRecipes from "../../pages/recipes/MyRecipes";
import EditRecipe from "../../pages/recipes/EditRecipe";
import { useSnapshot } from "valtio";
import userState from "../../states/user";
import RecipeDetails from "../../pages/recipes/RecipeDetails";
import MyBooks from "../../pages/books/MyBooks";
import AddBook from "../../pages/books/AddBook";
import EditBook from "../../pages/books/EditBook";
import Activity from "../../pages/activities/Activity";
import MyActivities from "../../pages/activities/MyActivities";
import CreateActivity from "../../pages/activities/CreateActivity";
import EditActivity from "../../pages/activities/EditActivity";
import MonthlyActivities from "../../pages/activities/MonthlyActivities";

export default function Layout() {
  const { user } = useSnapshot(userState);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header />
      <Routes>
        <Route exact path='/' Component={App} />
        <Route path='/login' Component={Login} />
        <Route path='/signup' Component={SignUp} />
        <Route path='/category/:id' Component={CategoryRecipes} />
        <Route
          path='/recipes/new'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <NewRecipe />
              </ProtectedRoute>
            );
          }}
        />
        <Route
          path='/my-recipes'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <MyRecipes />
              </ProtectedRoute>
            );
          }}
        />

        <Route
          path='/books/new'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <AddBook />
              </ProtectedRoute>
            );
          }}
        />

        <Route
          path='/books/:id'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <EditBook />
              </ProtectedRoute>
            );
          }}
        />

        <Route
          path='/my-books'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <MyBooks />
              </ProtectedRoute>
            );
          }}
        />

        <Route
          path='/my-activities'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <MyActivities />
              </ProtectedRoute>
            );
          }}
        />

        <Route
          path='/create-activity'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <CreateActivity />
              </ProtectedRoute>
            );
          }}
        />
        <Route
          path='/edit-activity/:id'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <EditActivity />
              </ProtectedRoute>
            );
          }}
        />

        <Route
          path='/edit-recipe'
          Component={() => {
            return (
              <ProtectedRoute
                isAllowed={!!user && user.role === "business"}
                redirectPath={user ? "/" : "/login"}
              >
                <EditRecipe />
              </ProtectedRoute>
            );
          }}
        />

        <Route path='/recipe-details/:id' Component={RecipeDetails} />

        <Route path='/activity/:id' Component={Activity} />
        <Route path='/activities/monthly' Component={MonthlyActivities} />

        <Route
          path='*'
          Component={() => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <h1>404</h1>
                <h3>page not found</h3>
                <p>Its look like you trying to reach a page that does not exsits</p>
              </div>
            );
          }}
        />
      </Routes>
    </div>
  );
}

// Layout.propTypes = {
//   children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
// };
