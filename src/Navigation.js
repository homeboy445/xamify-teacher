import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthContext from "./Context";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import Menu from "./components/Menu/Menu";
import Dashboard from "./components/Dashboard/Dashboard";
import StudentsPage from "./components/StudentsPage/StudentsPage";
import axios from "axios";
import Cookie from "js-cookie";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import ExamDetails from "./components/ExamDetails/ExamDetails";
import ExamCreator from "./components/ExamCreator/ExamCreator";
import TeachersPage from "./components/TeachersPage/TeachersPage";
import CoursePage from "./components/CoursePage/CoursePage";

const Navigation = () => {
  const Main = useContext(AuthContext);

  const HandleAuth = (token) => {
    if (token !== undefined && token.length !== 0) {
      Cookie.set("teacher", token);
      Main.changeAuth(true);
      Main.toggleMenu(true);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div>
      {Main.Auth &&
      Main.ActiveRoute !== "ExamDetails" &&
      Main.ActiveRoute !== "ExamCreator" ? (
        <Menu changeAuth={Main.changeAuth} />
      ) : null}
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            Main.updateActiveRoute("Home");
            return !Main.Auth ? <Home /> : <Redirect to="/dashboard" />;
          }}
        />
        <Route
          path="/signin"
          render={() => {
            Main.updateActiveRoute("SignIn");
            return !Main.Auth ? (
              <SignIn HandleAuth={HandleAuth} />
            ) : (
              <Redirect to="/dashboard" />
            );
          }}
        />
        <Route
          path="/dashboard"
          render={() => {
            Main.updateActiveRoute("Dashboard");
            return Main.Auth ? <Dashboard /> : <Redirect to="/signin" />;
          }}
        />
        <Route
          path="/studentpage"
          render={() => {
            Main.updateActiveRoute("Student Page");
            return Main.Auth ? <StudentsPage /> : <Redirect to="/signin" />;
          }}
        />
        <Route
          path="/teacherpage"
          render={() => {
            Main.updateActiveRoute("Teacher Page");
            return Main.Auth ? <TeachersPage /> : <Redirect to="/signin" />;
          }}
        />
        <Route
          path="/examdetails"
          render={() => {
            Main.updateActiveRoute("ExamDetails");
            return Main.Auth ? <ExamDetails /> : <Redirect to="/signin" />;
          }}
        />
        <Route
          path="/coursepage"
          render={() => {
            Main.updateActiveRoute("Course Page");
            return Main.Auth ? <CoursePage /> : <Redirect to="/signin" />;
          }}
        />
        <Route
          path="/examcreator"
          render={() => {
            Main.updateActiveRoute("ExamCreator");
            return Main.Auth ? <ExamCreator /> : <Redirect to="/signin" />;
          }}
        />
      </Switch>
    </div>
  );
};

export default Navigation;
