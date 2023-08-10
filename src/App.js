import { useContext } from "react";

import "./App.css";
import UserContext from "./context/UserContext";
import AuthContext from "./context/AuthContext";
import Header from "./components/header/Header";
import Categories from "./components/categories/Categories";

function App() {
  const user = useContext(UserContext);
  const auth = useContext(AuthContext);

  console.log(user.user);
  console.log(auth.token);
  return (
    <div className='App'>
      <Header />
      <Categories />
    </div>
  );
}

export default App;
