import { proxy, subscribe } from "valtio";

const stateFromLocalStorage = localStorage.getItem("user");
const initialState = stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : null;

const userState = proxy({
  user: initialState,
  setUser: (user) => {
    userState.user = user;
  },
});

subscribe(userState, () => {
  localStorage.setItem("user", JSON.stringify(userState.user));
});

export default userState;
