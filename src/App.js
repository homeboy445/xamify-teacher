import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext from "./Context";
import axios from "axios";
import Cookie from "js-cookie";
import Navigation from "./Navigation";

const App = () => {
  const [Auth, changeAuth] = useState(false);
  const [AccessToken, update_Token] = useState(null);
  const [userInfo, update_Info] = useState({});
  const url = "https://xamify.herokuapp.com/api";

  const RefreshAccessToken = () => {
    return;
    console.log("Called");
    axios //This is not working... !@@
      .post(url + "/auth/token", {}, {
        token: Cookie.get("teacher")
      })
      .then((response) => {
        Cookie.set("teacher", response.data.accessToken);
        console.log(response.data);
      });
  };

  useEffect(() => {
    let cookieValue = Cookie.get("teacher");
    if (cookieValue !== "undefined" && typeof cookieValue !== undefined) {
      update_Token(`Bearer ${cookieValue}`);
      if (!Auth.status) {
        changeAuth(true);
      }
      axios
        .get(`${url}/auth/me`, {
          headers: {
            Authorization: AccessToken,
          },
        })
        .then((response) => {
          update_Info(response.data);
        })
        .catch((err) => {
          console.log(err);
          RefreshAccessToken();
        });
    } else {
      if (Auth.status) {
        changeAuth(false);
      }
    }
  }, [Auth, AccessToken]);

  return (
    <AuthContext.Provider
      value={{
        Auth,
        changeAuth,
        AccessToken,
        userInfo,
        url,
        RefreshAccessToken,
      }}
    >
      <Router>
        <Navigation />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
