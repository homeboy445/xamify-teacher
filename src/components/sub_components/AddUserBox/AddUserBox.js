import React, { useState } from "react";
import "./AddUserBox.css";
import InputBox from "../InputBox/InputBox";
import Dropdown from "../Dropdown/Dropdown";

const AddUserBox = ({ DetailBox, title, type, closeBox }) => {
  const [firstName, set_fName] = useState("");
  const [secondName, set_SName] = useState("");
  const [email, set_Email] = useState("");
  const [course, set_Course] = useState("Choose course");
  const [year, set_Year] = useState("Choose year");

  return (
    <div
      className="db-info-bx"
      style={{
        transition: "0.5s ease",
        transform: !DetailBox ? "translate(-200%, 0%)" : "translate(-30%, 0%)",
      }}
    >
      <h1 className="info_title">{title}</h1>
      {type === "student" ? (
        <h3 className="info_title_1">
          {
            "Student's accounts activation will take place after the verification of it by the student."
          }
        </h3>
      ) : null}
      <div className="info_bx_1">
        <InputBox
          type="text"
          placeholder="First Name"
          onChangeCallback={(e) => {
            set_fName(e.target.value.trim());
          }}
          value={firstName}
        />
        <InputBox
          type="text"
          placeholder="Second Name"
          onChangeCallback={(e) => {
            set_SName(e.target.value.trim());
          }}
          value={secondName}
        />
      </div>
      <div className="info_eml">
        <InputBox
          className="dd"
          type="email"
          placeholder="Email"
          onChangeCallback={(e) => {
            set_Email(e.target.value.trim());
          }}
          value={email}
        />
      </div>
      {type === "student" ? (
        <div className="usr_drp_down">
          <Dropdown
            list={["Comp.Sci.", "Math", "Physics", "Chemistry"]}
            value={course}
            onChangeCallback={(e) => {
              set_Course(e.target.value);
            }}
          />
          <Dropdown
            list={["1st year", "2nd year", "3rd year", "4th year"]}
            value={year}
            onChangeCallback={(e) => {
              set_Year(e.target.value);
            }}
          />
        </div>
      ) : null}
      <div className="inf_btns">
      <button className="add_usr_btn">Add {type}</button>
      <button onClick={closeBox}>Cancel</button>
      </div>
    </div>
  );
};

export default AddUserBox;
