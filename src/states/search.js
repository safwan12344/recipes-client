import { proxy } from "valtio";

const searchState = proxy({
  search: "",
  results: [],
  isLoading: false,
  setSearch: (q) => {
    searchState.search = q;
  },
  setResults: (results) => {
    searchState.results = results;
  },
  setIsLoading: (isLoading) => {
    searchState.isLoading = isLoading;
  },
});

export default searchState;
