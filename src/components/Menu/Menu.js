import React from "react";
import "./Menu.css";
import Dashboard_Icon from "../../assets/icons/dashboard.svg";
import Student_Icon from "../../assets/icons/student.svg";
import Teacher_Icon from "../../assets/icons/teacher.svg";
import Course_Icon from "../../assets/icons/course.svg";
import Assessment_Icon from "../../assets/icons/assessment.svg";
import Statistics_Icon from "../../assets/icons/stats.svg";
import ImageFrame from "../sub_components/ImageFrame/ImageFrame";
import Dashboard from "../Dashboard/Dashboard";

const Menu = () => {
  return (
    <div className="menu">
      <h1 className="title">Xamify</h1>
      <div className="menu-1">
        <ImageFrame image={Dashboard_Icon} />
        <h2>FirstName</h2>
      </div>
      <div className="menu-2">
        <div>
          <img src={Dashboard_Icon} alt="" />
          <h2>Dashboard</h2>
        </div>
        <div>
          <img src={Assessment_Icon} alt="" />
          <h2>Assessment</h2>
        </div>
        <div>
          <img src={Student_Icon} alt="" />
          <h2>Students</h2>
        </div>
        <div>
          <img src={Teacher_Icon} alt="" />
          <h2>Teachers</h2>
        </div>
        <div>
          <img src={Course_Icon} alt="" />
          <h2>Course</h2>
        </div>
        <div>
          <img src={Statistics_Icon} alt="" />
          <h2>Year</h2>
        </div>
      </div>
      <h1 className="SignOut">Sign out</h1>
    </div>
  );
};

export default Menu;
