import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthContext from "./Context";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import Menu from "./components/Menu/Menu";
import Dashboard from "./components/Dashboard/Dashboard";
import StudentsPage from "./components/StudentsPage/StudentsPage";
import Cookie from "js-cookie";
import ExamDetails from "./components/ExamDetails/ExamDetails";
import ExamCreator from "./components/ExamCreator/ExamCreator";
import TeachersPage from "./components/TeachersPage/TeachersPage";
import CoursePage from "./components/CoursePage/CoursePage";
import CourseDetail from "./components/CoursePage/CourseDetail";
import ErrorBox from "./components/ErrorBox/ErrorBox";


const Navigation = () => {
  const Main = useContext(AuthContext);

  const HandleAuth = (token, rtoken) => {
    if (token !== undefined && token.length !== 0) {
      Cookie.set("teacher", token);
      Cookie.set("refresh", `${rtoken}|${new Date().toISOString()}`);
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
          path="/examcreator/:id"
          render={(props) => {
            Main.updateActiveRoute("ExamCreator");
            return Main.Auth ? (
              <ExamCreator {...props} />
            ) : (
              <Redirect to="/signin" />
            );
          }}
        />
        <Route
          path="/coursedetails/:id"
          render={(props) => {
            Main.updateActiveRoute("CourseDetail");
            return Main.Auth ? (
              <CourseDetail {...props} />
            ) : (
              <Redirect to="/signin" />
            );
          }}
        />
        <Redirect from="*" to="/" />
      </Switch>
      {Main.isError.is ? <ErrorBox info={Main.isError.info} /> : null}
    </div>
  );
};

export default Navigation;
