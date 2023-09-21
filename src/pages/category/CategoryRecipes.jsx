import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Recipes from "../../components/recipes/Recipes";
import { useSnapshot } from "valtio";
import errorState from "../../states/error";

function CategoryRecipes() {
  const { id } = useParams();
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const errorSnap = useSnapshot(errorState);

  useEffect(() => {
    const getRecepies = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories/${id}/recipes`);
      setRecipes(response.data);
      errorSnap.setError(null);
    };

    getRecepies().catch((error) => {
      if (error.toJSON().message === "Network Error") {
        errorSnap.setError("Server is unavailable please try later");
      } else {
        errorSnap.setError(
          error.response.data?.message || "Server is unavailable please try later",
        );
      }
    });
  }, []);

  const goToRecipePage = (recipe) => {
    navigate(`/recipe-details/${recipe._id}`);
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <Recipes recipes={recipes} onRecipeClick={goToRecipePage} />
    </div>
  );
}

export default CategoryRecipes;
