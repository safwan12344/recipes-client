import { proxy, subscribe } from "valtio";

const stateFromLocalStorage = localStorage.getItem("token");
const initialState = stateFromLocalStorage || "";

const authState = proxy({
  token: initialState,
  setToken: (token) => {
    authState.token = token;
  },
});

subscribe(authState, () => {
  localStorage.setItem("token", authState.token);
});

export default authState;
