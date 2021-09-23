import React, { useState, useEffect, useContext } from "react";
import "./ExamDetails.css";
import AuthContext from "../../Context";
import axios from "axios";
import Dropdown from "../sub_components/Dropdown/Dropdown";
import Arrow from "../../assets/Images/right-arrow.png";

const ExamDetails = () => {
  const getCurHour = (val) => {
    let n = new Date().getHours() + val;
    return n < 10 ? "0" + n : n;
  };

  const getCurMinutes = () => {
    let n = new Date().getMinutes();
    return n < 10 ? "0" + n : n;
  };

  const Main = useContext(AuthContext);
  const [subject, set_Subject] = useState("Choose subject");
  const [subjectList, update_List] = useState([]);
  const [fetchedData, updateStatus] = useState(false);
  const [ExamTakingMode, set_Mode] = useState("Typed");
  const [startTime, set_Stime] = useState(`${getCurHour(0)}:${getCurMinutes()}`);
  const [endTime, set_Etime] = useState(
    `${getCurHour(1)}:${getCurMinutes()}`
  );

  const getTodaysDate = (val) => {
    var obj = new Date();
    var dd = obj.getDate(),
      mm = obj.getMonth(),
      yy = obj.getFullYear();
    return yy + val + "-" + (mm < 10 ? "0" + mm : mm) + "-" + dd;
  };
  const [startDate, set_Sdate] = useState(getTodaysDate(0));
  const [endDate, set_Edate] = useState(getTodaysDate(0));

  useEffect(() => {
    if (Main.AccessToken !== null && !fetchedData) {
      Main.toggleLoader(true);
      axios
        .get(Main.url + "/subjects", {
          headers: {
            Authorization: Main.AccessToken,
          },
        })
        .then((response) => {
          update_List(response.data);
          set_Subject(response.data[0].name);
          updateStatus(true);
          Main.toggleLoader(false);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
  }, [Main]);

  const getList = () => {
    let arr = [];
    subjectList.map((item) => {
      arr.push(item.name);
      return null;
    });
    return arr;
  };

  const getSubId = (subName) => {
    return subjectList.find((item) => item.name === subName).id;
  };

  const HandleSubmit = () => {
    let dObj = new Date(),
      dObj1 = new Date(),
      mm = new Date();
    let dT = startDate.split("-"),
      cT = startTime.split(":");
    dObj.setFullYear(parseInt(dT[0]), parseInt(dT[1]), parseInt(dT[2]));
    dObj.setHours(parseInt(cT[0]), parseInt(cT[1]));
    dT = endDate.split("-");
    cT = endTime.split(":");
    dObj1.setFullYear(parseInt(dT[0]), parseInt(dT[1]), parseInt(dT[2]));
    dObj1.setHours(parseInt(cT[0]), parseInt(cT[1]));
    let diff = dObj1 - dObj;
    if (dObj - mm < 0) {
      return Main.toggleErrorBox({
        is: true,
        info: "Please choose a future time or the present time.",
      });
    }
    if (diff < 0) {
      return Main.toggleErrorBox({
        is: true,
        info: "End Date/Time is smaller than Start Date/Time",
      });
    }
    const ExamObject = {
      type: ExamTakingMode === "Typed" ? "DIGITAL" : "WRITTEN",
      startTime: dObj.toISOString(),
      endTime: dObj1.toISOString(),
      subjectId: getSubId(subject),
    };
    if (
      !window.confirm(
        "Are you sure with these credentials as these cannot be edited again and would like to proceed further?"
      )
    ) {
      return;
    }
    axios
      .post(Main.url + "/assessments", ExamObject, {
        headers: {
          Authorization: Main.AccessToken,
        },
      })
      .then((response) => {
        window.location.href = `/examcreator/${response.data.id}`;
      })
      .catch((err) => {
        Main.RefreshAccessToken();
        Main.toggleErrorBox({
          is: true,
          info: "There was an error, try again later.",
        });
      });
  };

  return (
    <div className="examDetails">
      <div className="exMD_title">
        <img
          src={Arrow}
          alt="<-"
          onClick={() => (window.location.href = "/dashboard")}
        />
        <h1> Exam Details </h1>
      </div>
      <div className="exD_1">
        <h2> Choose Subject </h2>
        <Dropdown
          list={getList()}
          value={subject}
          onChangeCallback={(e) => {
            set_Subject(e.target.value);
          }}
        />
      </div>
      <div className="exD_mode">
        <h2 className="exD_tl_2">
          Choose Mode of Exam taking(MCQs are available by default)
        </h2>
        <Dropdown
          list={["Typed", "Hand Written(via image upload)"]}
          value={ExamTakingMode}
          onChangeCallback={(e) => {
            set_Mode(e.target.value);
          }}
        />
      </div>
      <div className="pub_1">
        <h2 className="pub_tl_1"> Choose start date & time</h2>
        <div>
          <input
            type="date"
            name="D.O.E"
            value={startDate}
            onChange={(e) => set_Sdate(e.target.value)}
            min={startDate}
            max={getTodaysDate(1)}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              set_Stime(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="pub_2">
        <h2 className="pub_tl_1"> Choose end date & time</h2>
        <div>
          <input
            type="date"
            name="D.O.E"
            value={endDate}
            onChange={(e) => set_Edate(e.target.value)}
            min={startDate}
            max={getTodaysDate(1)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => {
              set_Etime(e.target.value);
            }}
          />
        </div>
      </div>
      <button className="exmD_btn" onClick={HandleSubmit}>
        Create & Edit Test
      </button>
    </div>
  );
};

export default ExamDetails;
