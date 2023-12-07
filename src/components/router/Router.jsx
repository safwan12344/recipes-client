import { useLayoutEffect, useState } from "react";
import { Router as RouterRRD } from "react-router-dom";
import PropTypes from "prop-types"

const Router = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <RouterRRD
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};
export default Router

Router.propTypes = {
    history: PropTypes.object.isRequired,
};