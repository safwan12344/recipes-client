import React, { useEffect, useLayoutEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import "./Search.css";
import axios from "axios";
import { useSnapshot } from "valtio";
import searchState from "../../states/search";
import authState from "../../states/auth";
import { useLocation } from "react-router-dom";

function Search() {
  const searchSnap = useSnapshot(searchState);
  const authSnap = useSnapshot(authState);
  const location = useLocation();
  const pathname = location.pathname;

  const isInMyRecipes = /(\/my-recipes)/g.test(pathname);

  const searchRecipe = (e) => {
    searchSnap.setIsLoading(true);
    searchSnap.setSearch(e.target.value);
  };

  useEffect(() => {
    const timeId = setTimeout(async () => {
      if (searchSnap.search) {
        console.log({ pathname });
        if (isInMyRecipes) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/recipes/auth/search?q=${searchSnap.search}`,
            {
              headers: {
                Authorization: `TOKEN ${authSnap.token}`,
              },
            },
          );
          searchSnap.setResults(response.data);
        } else {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/recipes/search?q=${searchSnap.search}`,
          );
          searchSnap.setResults(response.data);
        }
      } else {
        searchSnap.setResults([]);
      }
    }, 1000);

    const t = setTimeout(() => searchSnap.setIsLoading(false), 2000);

    return () => {
      clearTimeout(timeId);
      clearTimeout(t);
    };
  }, [searchSnap.search]);

  useLayoutEffect(() => {
    searchSnap.setSearch("");
  }, [pathname]);

  return (
    <InputGroup className='search'>
      <i className='icon-search fa-solid fa-magnifying-glass' style={{ color: "black" }}></i>
      <Form.Control
        onChange={searchRecipe}
        value={searchSnap.search}
        className='search-input'
        placeholder='Search Recipe'
      />
    </InputGroup>
  );
}

export default Search;
