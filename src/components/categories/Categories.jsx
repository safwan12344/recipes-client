import axios from "axios";
import { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("http://localhost:3002/categories");
      setCategories(response.data);
    };

    getCategories();
  }, []);

  if (!categories) {
    return <div>Loading categories...</div>;
  }

  const onSelectCategory = (category) => {
    alert("test" + category._id);
  };

  return (
    <div className='categories'>
      {categories.map((category) => {
        return (
          <div onClick={() => onSelectCategory(category)} className='category' key={category._id}>
            <Image className='category-image' src={category.imageURL} alt={category.name} rounded />
            <div className='category-name'>{category.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
