import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext from "./Context";
import axios from "axios";
import Cookie from "js-cookie";
import Navigation from "./Navigation";

const isCookieAlive = () => {
  return (
    typeof Cookie.get("teacher") !== undefined &&
    Cookie.get("teacher") !== "undefined"
  );
};

const App = () => {
  const [Auth, changeAuth] = useState(isCookieAlive());
  const [AccessToken, update_Token] = useState(null);
  const [userInfo, update_Info] = useState({});
  const [ActiveRoute, update_ActiveRoute] = useState("Home");
  const [refreshTokenManager, update_Manager] = useState(new Date());
  const [isError, toggleErrorStatus] = useState({
    is: false,
    info: "Testing...",
  });
  const url = "https://xamify.herokuapp.com/api";

  const RefreshAccessToken = () => {
    let d = new Date();
    let diff = d - refreshTokenManager;
    if (Math.floor(diff / 60e3) < 10) {
      return;
    }
    axios
      .post(url + "/auth/token", {
        token: Cookie.get("refresh"),
      })
      .then((response) => {
        if (!Auth) {
          return;
        }
        Cookie.set("teacher", response.data.accessToken);
        Cookie.set("refresh", response.data.refreshToken);
      });
  };

  useEffect(() => {
    let cookieValue = Cookie.get("teacher");
    if (isCookieAlive()) {
      update_Token(`Bearer ${cookieValue}`);
      update_Manager(new Date());
      if (!Auth) {
        changeAuth(true);
      }
      axios
        .get(`${url}/auth/me`, {
          headers: { Authorization: `Bearer ${cookieValue}` },
        })
        .then((response) => {
          update_Info(response.data);
        })
        .catch((err) => {
          RefreshAccessToken();
        });
    } else {
      if (Auth) {
        changeAuth(false);
      }
    }
  }, [Auth, AccessToken]);

  return (
    <AuthContext.Provider
      value={{
        Auth,
        changeAuth: (val) => changeAuth(val),
        AccessToken,
        userInfo,
        url,
        RefreshAccessToken,
        ActiveRoute,
        updateActiveRoute: (val) => update_ActiveRoute(val),
        isError,
        toggleErrorBox: (val) => {
          toggleErrorStatus(val);
          if (val.is) {
            setTimeout(() => {
              toggleErrorStatus(false);
            }, 10000);
          }
        },
      }}
    >
      <Router>
        <Navigation />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
