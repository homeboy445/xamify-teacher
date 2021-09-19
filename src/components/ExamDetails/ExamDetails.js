import React, { useState, useEffect } from "react";
import "./ExamDetails.css";
import Dropdown from "../sub_components/Dropdown/Dropdown";

const ExamDetails = () => {
  const [subject, set_Subject] = useState("Choose subject");
  const [duration, set_duration] = useState([]);
  const [hours, set_hours] = useState(1);
  const [minutes, set_minutes] = useState(0);
  const [seconds, set_seconds] = useState(0);
  const [ExamTakingMode, set_Mode] = useState("Typing");

  useEffect(() => {
    let k = [];
    for (var i = 0; i < 60; i++) {
      k.push(i);
    }
    set_duration(k);
  }, []);

  const HandleSubmit = () =>{
      const ExamObject={
          subject: subject,
          duration: `${hours}:${minutes}:${seconds}`,
          examMode: ExamTakingMode
      };
      console.log(ExamObject); //Submit this object...
  }

  return (
    <div className="examDetails">
      <h1 className="exMD_title">Exam Details</h1>
      <div className="exD_1">
        <h2>Choose Subject</h2>
        <Dropdown
          list={["Comp.Sci.", "Math", "Physics", "Chemistry"]}
          value={subject}
          onChangeCallback={(e) => {
            set_Subject(e.target.value);
          }}
        />
      </div>
      <div className="exD_2">
        <h2 className="exD_tl_1">Choose total duration of the exam</h2>
        <div className="exD_2_1">
          <div>
            <select value={hours} onChange={(e) => set_hours(e.target.value)}>
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <h2>hours</h2>
          </div>
          <div>
            <select
              value={minutes}
              onChange={(e) => set_minutes(e.target.value)}
            >
              {duration.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <h2>minutes</h2>
          </div>
          <div>
            <select
              value={seconds}
              onChange={(e) => set_seconds(e.target.value)}
            >
              {duration.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <h2>second</h2>
          </div>
        </div>
      </div>
      <div className="exD_mode">
        <h2 className="exD_tl_2">
          Choose Mode of Exam taking(MCQ's are available by default)
        </h2>
        <Dropdown
          list={["Typed", "Hand Written(via image upload)"]}
          value={ExamTakingMode}
          onChangeCallback={(e) => {
            set_Mode(e.target.value);
          }}
        />
      </div>
      <button className="exmD_btn" onClick={HandleSubmit}>Create & Edit Test</button>
    </div>
  );
};

export default ExamDetails;
