import { proxy, subscribe } from "valtio";

const stateFromLocalStorage = localStorage.getItem("error");
const initialState = stateFromLocalStorage || null;

const errorState = proxy({
  error: initialState,
  setError: (error) => {
    errorState.error = error;
  },
});

subscribe(errorState, () => {
  localStorage.setItem("error", errorState.error);
});

export default errorState;
