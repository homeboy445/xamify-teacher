import React from "react";
import { Route, Redirect } from "react-router-dom";
const ProtectedRoutes = ({ Auth, Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        return Auth ? <Component /> : <Redirect to="/signin" />;
      }}
    />
  );
};
export default ProtectedRoutes;
