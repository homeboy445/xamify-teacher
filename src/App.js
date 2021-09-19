import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AuthContext from "./Context";
import Cookie from "js-cookie";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import Menu from "./components/Menu/Menu";
import Dashboard from "./components/Dashboard/Dashboard";
import StudentsPage from "./components/StudentsPage/StudentsPage";
import axios from "axios";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import ExamDetails from "./components/ExamDetails/ExamDetails";
import ExamCreator from "./components/ExamCreator/ExamCreator";

const App = () => {
  const [Auth, change_Auth] = useState({
    status: false,
  });

  let curURI = window.location.href;
  curURI = curURI.slice(curURI.lastIndexOf("/") + 1);
  console.log(curURI, ' ', Auth);

  useEffect(() => {
    let cookieValue = Cookie.get("teacher");
    cookieValue = cookieValue === "undefined" ? undefined : cookieValue;
    if (cookieValue) {
      if (!Auth.status) {
        change_Auth({ status: true });
      }
    } else {
      if (Auth.status) {
        change_Auth({ status: false });
      }
    }
  }, [Auth]);

  return (
    <AuthContext.Provider value={{ Auth }}>
      <Router>
        {Auth.status && curURI !== "examcreator" ? (
          <Menu changeAuth={change_Auth} />
        ) : null}
        <Switch>
          {/* <Route path="/" render={()=>{
            return !Auth.status ? <Home />: <Redirect to="/dashboard" />
          }} />
          <Route path="/dashboard" render={()=>{
            return Auth.status ? <Dashboard />: <Redirect to="/" />
          }} />
          <Route path="/studentpage" render={()=>{
            return Auth.status ? <StudentsPage />: <Redirect to="/" />
          }} />
          <Route path="/signin" render={()=>{
            return !Auth.status ? <SignIn />: <Redirect to="/dashboard" />
          }} /> */}
          <Route path="/examcreator">
            <ExamCreator />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
