import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context";
import "./ExamDetails.css";
import Dropdown from "../sub_components/Dropdown/Dropdown";
import Arrow from "../../assets/Images/right-arrow.png";

const ExamDetails = () => {
  const Main = useContext(AuthContext);
  const [subject, set_Subject] = useState("Choose subject");
  const [duration, set_duration] = useState([]);
  const [hours, set_hours] = useState(1);
  const [minutes, set_minutes] = useState(0);
  const [seconds, set_seconds] = useState(0);
  const [ExamTakingMode, set_Mode] = useState("Digital");
  const [TimeOfExam, set_time] = useState("10:00");
  const [endTime, setEndTime] = useState(new Date());

  const getDate = () => {
    const obj = endTime;
    var dd = obj.getDate(),
      mm = obj.getMonth(),
      yy = obj.getFullYear();
    return yy + "-" + (mm < 10 ? "0" + mm : mm) + "-" + dd;
  };
  const setDate = (date) => {
    const obj = endTime;
    const val = date.split("-");
    obj.setFullYear(val[0], val[1], val[2]);
    console.log(obj.toISOString());
    setEndTime(obj);
  };
  const setTime = (time) => {
    const obj = endTime;
    const val = time.split(":");
    obj.setHours(val[0]);
    obj.setMinutes(val[1]);
  };
  const getTime = () => {
    const obj = endTime;
    return `${obj.getHours()}:${obj.getMinutes()}`;
  };
  const getTodaysDate = (val) => {
    var obj = new Date();
    var dd = obj.getDate(),
      mm = obj.getMonth(),
      yy = obj.getFullYear();
    return yy + val + "-" + (mm < 10 ? "0" + mm : mm) + "-" + dd;
  };
  const [DateOfExam, set_date] = useState(getTodaysDate(0));

  useEffect(() => {
    let k = [];
    for (var i = 0; i < 60; i++) {
      k.push(i);
    }
    set_duration(k);
  }, [Main]);

  const HandleSubmit = () => {
    const ExamObject = {
      type: ExamTakingMode,
      subjectId: "",
      startTime: `${DateOfExam}|${TimeOfExam}`,
      duration: `${hours}:${minutes}:${seconds}`,
    };
    console.log("Date:", getDate());
    console.log("Time:", getTime());
    console.log(ExamObject); //Submit this object...
    setDate(getDate());
  };

  return (
    <div className="examDetails">
      <div className="exMD_title">
        <img src={Arrow} alt="<-" onClick={()=>window.location.href="/dashboard"}/>
        <h1> Exam Details </h1>
      </div>
      <div className="exD_1">
        <h2> Choose Subject </h2>{" "}
        <Dropdown
          list={["Comp.Sci.", "Math", "Physics", "Chemistry"]}
          value={subject}
          onChangeCallback={(e) => {
            set_Subject(e.target.value);
          }}
        />{" "}
      </div>{" "}
      <div className="exD_2">
        <h2 className="exD_tl_1"> Choose total duration of the exam </h2>{" "}
        <div className="exD_2_1">
          <div>
            <select value={hours} onChange={(e) => set_hours(e.target.value)}>
              {" "}
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {" "}
                    {item}{" "}
                  </option>
                );
              })}{" "}
            </select>{" "}
            <h2> hours </h2>{" "}
          </div>{" "}
          <div>
            <select
              value={minutes}
              onChange={(e) => set_minutes(e.target.value)}
            >
              {" "}
              {duration.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {" "}
                    {item}{" "}
                  </option>
                );
              })}{" "}
            </select>{" "}
            <h2> minutes </h2>{" "}
          </div>{" "}
          <div>
            <select
              value={seconds}
              onChange={(e) => set_seconds(e.target.value)}
            >
              {" "}
              {duration.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {" "}
                    {item}{" "}
                  </option>
                );
              })}{" "}
            </select>{" "}
            <h2> second </h2>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="exD_mode">
        <h2 className="exD_tl_2">
          Choose Mode of Exam taking(MCQ 's are available by default){" "}
        </h2>{" "}
        <Dropdown
          list={["Typed", "Hand Written(via image upload)"]}
          value={ExamTakingMode}
          onChangeCallback={(e) => {
            set_Mode(e.target.value);
          }}
        />{" "}
      </div>{" "}
      <div className="pub_dtls_1">
        <h2 className="pub_tl_1"> Choose publish date </h2>{" "}
        <input
          type="date"
          name="D.O.E"
          value={DateOfExam}
          onChange={(e) => set_date(e.target.value)}
          min={DateOfExam}
          max={getTodaysDate(1)}
        />{" "}
      </div>{" "}
      <div className="pub_dtls_2">
        <h2 className="pub_tl_2"> Choose publish time </h2>{" "}
        <input
          type="time"
          value={TimeOfExam}
          onChange={(e) => {
            set_time(e.target.value);
          }}
        />{" "}
      </div>{" "}
      <button className="exmD_btn" onClick={HandleSubmit}>
        Create & Edit Test{" "}
      </button>{" "}
    </div>
  );
};

export default ExamDetails;
