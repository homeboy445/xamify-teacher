import React, { useEffect, useContext } from "react";
import "./Menu.css";
import { Link } from "react-router-dom";
import AuthContext from "../../Context";
import Dashboard_Icon from "../../assets/icons/dashboard.svg";
import Student_Icon from "../../assets/icons/student.svg";
import Teacher_Icon from "../../assets/icons/teacher.svg";
import Course_Icon from "../../assets/icons/course.svg";
import ImageFrame from "../sub_components/ImageFrame/ImageFrame";

const Menu = ({ changeAuth }) => {
  const Main = useContext(AuthContext);

  useEffect(() => null, [Main]);

  return (
    <div className="menu">
      <h1 className="title">Xamify</h1>
      <div className="menu-1">
        <h2>{Main.userInfo.name || "Admin User"}</h2>
      </div>
      <div className="menu-2">
        <div>
          <img src={Dashboard_Icon} alt="" />
          <Link
            to="/dashboard"
            style={{ textDecoration: "none", color: "black" }}
          >
            <h2
              className="dshbrd"
              style={{
                color: Main.ActiveRoute === "Dashboard" ? "blue" : "black",
              }}
            >
              Dashboard
            </h2>
          </Link>
        </div>
        <div>
          <img src={Student_Icon} alt="" />
          <Link
            to="/studentpage"
            style={{ textDecoration: "none", color: "black" }}
          >
            <h2
              className="studPage"
              style={{
                color: Main.ActiveRoute === "Student Page" ? "blue" : "black",
              }}
            >
              Students
            </h2>
          </Link>
        </div>
        <div>
          <img src={Teacher_Icon} alt="" />
          <Link
            to="/teacherpage"
            style={{ textDecoration: "none", color: "black" }}
          >
            <h2
              className="teachPage"
              style={{
                color: Main.ActiveRoute === "Teacher Page" ? "blue" : "black",
              }}
            >
              Teachers
            </h2>
          </Link>
        </div>
        <div>
          <img src={Course_Icon} alt="" />
          <Link
            to="/coursepage"
            style={{ textDecoration: "none", color: "black" }}
          >
            <h2
              className="coursePage"
              style={{
                color: Main.ActiveRoute === "Course Page" ? "blue" : "black",
              }}
            >
              Course
            </h2>
          </Link>
        </div>
      </div>
      <h1
        className="SignOut"
        onClick={() => {
          sessionStorage.clear();
          window.location.href = "/signin";
        }}
      >
        Sign out
      </h1>
    </div>
  );
};

export default Menu;
