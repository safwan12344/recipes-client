import { createContext } from "react";

export const TOKEN = {
  token: null,
};

const AuthContext = createContext();

export default AuthContext;
