import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext from "./Context";
import axios from "axios";
import Navigation from "./Navigation";

const isCookieAlive = () => {
  return sessionStorage.getItem("teacher") !== null;
};

const App = () => {
  const [Auth, changeAuth] = useState(isCookieAlive());
  const [AccessToken, update_Token] = useState(null);
  const [userInfo, update_Info] = useState({ email: "" });
  const [ActiveRoute, update_ActiveRoute] = useState("Home");
  const [loading, toggleLoader] = useState(false);
  const [isError, toggleErrorStatus] = useState({
    is: false,
    info: "Testing...",
  });
  const url = process.env.REACT_APP_SERVER_URL;

  const RefreshAccessToken = () => {
    let refCookie = sessionStorage.getItem("refresher");
    if (refCookie === null) {
      return;
    }
    try {
      refCookie = refCookie.split("|");
    } catch {
      sessionStorage.removeItem("refresher");
      return changeAuth(false);
    }
    let refreshToken = refCookie[0],
      t1 = new Date(),
      t2 = new Date(refCookie[1]);
    let diff = Math.floor((t1 - t2) / 60e3);
    if (diff < 10) {
      return;
    }
    axios
      .post(url + "/auth/token", {
        token: refreshToken,
      })
      .then((response) => {
        if (!Auth) {
          return;
        }
        sessionStorage.setItem("teacher", response.data.accessToken);
        // sessionStorage.setItem("refresher", response.data.refreshToken);
        update_Token(`Bearer ${response.data.accessToken}`);
      })
      .catch(() => {
        sessionStorage.removeItem("teacher");
        sessionStorage.removeItem("refresher");
        changeAuth(false);
      });
  };

  useEffect(() => {
    let cookieValue = sessionStorage.getItem("teacher");
    if (isCookieAlive()) {
      update_Token(`Bearer ${cookieValue}`);
      if (!Auth) {
        changeAuth(true);
      }
      axios
        .get(`${url}/auth/me`, {
          headers: { Authorization: `Bearer ${cookieValue}` },
        })
        .then((response) => {
          if (response.data.type === "STUDENT") {
            changeAuth(false);
            sessionStorage.setItem("teacher", null);
            return;
          }
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
        loading,
        toggleLoader: (v) => {
          toggleLoader(v);
          if (v) {
            setTimeout(() => toggleLoader(false), 15 * 1000);
          }
        },
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
        getStudentImageUrl: (studentName) => {
          return `https://api.dicebear.com/9.x/notionists/svg?seed=${studentName || "Vivian"}`;
        },
        getTeacherImageUrl: (teacherName) => {
          return `https://api.dicebear.com/9.x/initials/svg?seed=${teacherName || "Vivian"}`;
        },
        getCourseImageUrl: (courseName) => {
          return `https://api.dicebear.com/9.x/shapes/svg?seed=${courseName || "Vivian"}`;
        }
      }}
    >
      <Router>
        <Navigation />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
