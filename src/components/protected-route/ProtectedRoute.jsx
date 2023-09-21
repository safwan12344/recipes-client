import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProtectedRoute({ children, isAllowed, redirectPath }) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace={true} />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  isAllowed: PropTypes.bool,
  redirectPath: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

ProtectedRoute.defaultProps = {
  isAllowed: false,
  redirectPath: "/login",
};
