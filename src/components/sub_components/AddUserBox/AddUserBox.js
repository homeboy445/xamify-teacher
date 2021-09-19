import React, { useState } from "react";
import "./AddUserBox.css";
import csvToJson from "csvtojson";
import InputBox from "../InputBox/InputBox";
import Dropdown from "../Dropdown/Dropdown";
import CSV from "../../../assets/template.csv";

const AddUserBox = ({ DetailBox, title, type, closeBox }) => {
  const [firstName, set_fName] = useState("");
  const [secondName, set_SName] = useState("");
  const [email, set_Email] = useState("");
  const [course, set_Course] = useState("Choose course");
  const [year, set_Year] = useState("Choose year");
  const [curCSV, changeCurCsv] = useState(null);
  const [ActiveType, change_AType] = useState(1);

  return (
    <div
      className="s_box"
      style={{
        transition: "0.5s ease",
        transform: !DetailBox ? "translate(-200%, 0%)" : "translate(-30%, 0%)",
      }}
    >
      <div className="s_box_btns">
        <button onClick={() => {
          change_AType((ActiveType + 1)%2);
        }}> {ActiveType === 0 ? "Indivisual" : "Multiple"} </button>
      </div>
      {ActiveType === 0 ? (
        <div className="db-info-bx">
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
        </div>
      ) : (
        <div className="bulk_stud">
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
          <div className="bulk_stud_btns">
            <a href={CSV} download="template.csv">
              <button className="dwnload_csv">Download Template</button>
            </a>
            <label htmlFor="uploadCSV">Upload CSV</label>
            <input
              type="file"
              id="uploadCSV"
              accept=".csv"
              style={{ visibility: "hidden", pointerEvents: "none" }}
              onChange={(e) => {
                changeCurCsv(e.target.files[0]);
                console.log(e.target.files[0]);
                const reader = new FileReader();
                reader.onload=(e)=>{
                  let c = e.target.result;
                  console.log(c.split('\n'), ' ', typeof c);
                  csvToJson().fromString(c).then(response=>{
                    console.log(response); //CSV data
                  });
                }
                reader.readAsBinaryString(e.target.files[0]);
              }}
            />
          </div>
        </div>
      )}
      <div className="inf_btns">
        <button className="add_usr_btn">Add {type}{ActiveType===1?"s":null}</button>
        <button onClick={closeBox}>Cancel</button>
      </div>
    </div>
  );
};

export default AddUserBox;
