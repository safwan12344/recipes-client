import Image from "react-bootstrap/Image";
import "./Categories.css";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import categoriesState from "../../states/categories";

const Categories = () => {
  const { categories } = useSnapshot(categoriesState);

  if (!categories.length) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className='categories'>
      {categories.map((category) => {
        return (
          <Link key={category._id} to={`/category/${category._id}`}>
            <div className='category'>
              <Image
                className='category-image'
                src={category.imageURL}
                alt={category.name}
                rounded
              />
              <div className='category-name'>{category.name}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Categories;
