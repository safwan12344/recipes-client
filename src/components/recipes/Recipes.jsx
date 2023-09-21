import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "./Recipes.css";

export default function Recipes({ recipes, onRecipeClick }) {
  return (
    <div className='container-recipes'>
      {recipes.map((recipe) => {
        return (
          <Card onClick={() => onRecipeClick(recipe)} key={recipe._id} className='recipe'>
            <Card.Img className='img-recipe' variant='top' src={recipe.imageURL} />
            <Card.Body>
              <div className='rating'>
                <Card.Title>{recipe.name}</Card.Title>
                <span className='rating-number'>
                  <span className='style-rating'>rating:</span>
                  {recipe.rating.toFixed(2)}
                </span>
              </div>

              <Card.Text>{recipe.description}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
Recipes.propTypes = {
  recipes: PropTypes.array.isRequired,
  onRecipeClick: PropTypes.func.isRequired,
};
