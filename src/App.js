import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthContext from "./Context";
import Cookie from 'js-cookie';
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import Menu from "./components/Menu/Menu";
import Dashboard from "./components/Dashboard/Dashboard";
import StudentsPage from "./components/StudentsPage/StudentsPage";

const App = () => {
  const [Auth, change_Auth] = useState({status: false});

  useEffect(()=>{
      console.log(Cookie.get('user'));
  },[]);

  return (
    <AuthContext.Provider value={{ Auth }}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/studentpage">
            <StudentsPage />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
