import React from "react";
import { useSnapshot } from "valtio";
import searchState from "../../states/search";
import Recipes from "../recipes/Recipes";
import { useNavigate } from "react-router-dom";

function SearchRecipiesResault() {
  const searchSnap = useSnapshot(searchState);
  const navigate = useNavigate();

  const goToRecipePage = (recipe) => {
    navigate(`/recipe-details/${recipe._id}`);
  };

  return <Recipes recipes={searchSnap.results} onRecipeClick={goToRecipePage} />;
}

export default SearchRecipiesResault;
