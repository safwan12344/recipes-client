import { createContext } from "react";

export const USER = {
  _id: null,
  firstName: null,
  lastName: null,
  email: null,
  username: null,
  role: null,
};

const UserContext = createContext();

export default UserContext;
