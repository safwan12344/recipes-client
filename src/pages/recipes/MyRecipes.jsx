import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import Recipes from "../../components/recipes/Recipes";
import errorState from "../../states/error";
import searchState from "../../states/search";
import Loading from "../../assets/loading";

export default function MyRecipes() {
  const navigate = useNavigate();
  const authSnap = useSnapshot(authState);
  const errorSnap = useSnapshot(errorState);
  const searchSnap = useSnapshot(searchState);

  const [data, setData] = useState([]);
  const addNewRecipe = () => {
    navigate("/recipes/new");
  };

  useEffect(() => {
    const getAllMyRecipe = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes/my`, {
        headers: {
          authorization: `TOKEN ${authSnap.token}`,
        },
      });
      setData(response.data.recipes);
      errorSnap.setError(null);
    };

    getAllMyRecipe().catch((error) => {
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
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button style={{ margin: "20px 0px 20px 0px" }} onClick={addNewRecipe} variant='primary'>
          create new recipe
        </Button>
        <p style={{ marginLeft: "auto", marginRight: "auto", display: "inline-block" }}>
          My Recipes
        </p>
      </div>
      {searchSnap.search && searchSnap.isLoading && <Loading />}
      {searchSnap.search && !searchSnap.isLoading && (
        <>
          {searchSnap.results.length === 0 && <h1>No result were found for {searchSnap.search}</h1>}
          {searchSnap.results.length > 0 && <h1>Result were found for {searchSnap.search}</h1>}

          <Recipes
            recipes={searchSnap.results}
            onRecipeClick={(recipe) => {
              navigate("/edit-recipe", {
                state: { recipe: JSON.parse(JSON.stringify(recipe)) },
              });
            }}
          />
        </>
      )}

      {!searchSnap.search && (
        <Recipes
          recipes={searchSnap.results.length > 0 ? searchSnap.results : data}
          onRecipeClick={(recipe) => {
            navigate("/edit-recipe", {
              state: { recipe },
            });
          }}
        />
      )}
    </div>
  );
}
