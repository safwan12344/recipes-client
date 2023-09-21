import { proxy, subscribe } from "valtio";

const stateFromLocalStorage = localStorage.getItem("categories");
const initialState = stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : [];

const categoriesState = proxy({
  categories: initialState,
  setCategories: (categories) => {
    categoriesState.categories = categories;
  },
});

subscribe(categoriesState, () => {
  localStorage.setItem("categories", JSON.stringify(categoriesState.categories));
});

export default categoriesState;
