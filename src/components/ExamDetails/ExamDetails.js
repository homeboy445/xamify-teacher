import React, { useState, useEffect, useContext } from "react";
import Dropdown from "../sub_components/Dropdown/Dropdown";
import AuthContext from "../../Context";
import axios from "axios";
import "./ExamDetails.css";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EXAM_CREATION_PHASE = {
  INTRO: 0,
  CHOOSE_SUBJECT: 1,
  CHOOSE_MODE: 2,
  CHOOSE_DATE_TIME: 3,
};

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
  const [examCreationPhase, setExamCreationPhase] = useState(
    EXAM_CREATION_PHASE.INTRO
  );
  const [subject, set_Subject] = useState("");
  const [subjectList, update_List] = useState([]);
  const [fetchedData, updateStatus] = useState(false);
  const [ExamTakingMode, set_Mode] = useState("");
  const [startTime, set_Stime] = useState("");
  const [endTime, set_Etime] = useState("");
  const [showBackdrop, toggleBackdrop] = useState(false);

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

  const callSetStateWithBackdrop = (callback) => {
    toggleBackdrop(true);
    setTimeout(() => {
      callback();
      toggleBackdrop(false);
    }, 500);
  };

  const ChooseSubjectComponent = ({
    subjectList,
    selectedSubject,
    updateSelectedSubject,
  }) => {
    const [errorStore, setError] = useState({
      state: false,
      message: "",
    });
    return (
      <div className="choose-subject">
        <h2>Choose Subject for Examination</h2>
        <Dropdown
          label={"Choose Subject"}
          itemList={subjectList}
          valueHandler={[
            selectedSubject,
            (val) => {
              updateSelectedSubject(val[0]);
            },
          ]}
          errorHandler={errorStore}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            if (selectedSubject.trim()) {
              callSetStateWithBackdrop(() =>
                setExamCreationPhase(EXAM_CREATION_PHASE.CHOOSE_MODE)
              );
            } else {
              setError({
                state: true,
                message: "Please select a subject",
              });
            }
          }}
        >
          Proceed
        </Button>
      </div>
    );
  };

  const ChooseExamModeComponent = ({ examMode, updateExamMode }) => {
    const [errorStore, setError] = useState({
      state: false,
      message: "",
    });
    return (
      <div className="choose-exam-mode">
        <h2>Choose Exam Mode</h2>
        <Dropdown
          label={"Mode of Exam"}
          itemList={["Typed", "Hand Written(via image upload)"]}
          valueHandler={[examMode, (val) => updateExamMode(val[0])]} // Update the exam mode state
          errorHandler={errorStore}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            console.log("EXAM MODE: ", examMode);
            if (examMode.trim()) {
              callSetStateWithBackdrop(() =>
                setExamCreationPhase(EXAM_CREATION_PHASE.CHOOSE_DATE_TIME)
              );
            } else {
              setError({
                state: true,
                message: "Please select an exam mode",
              });
            }
          }}
        >
          Proceed
        </Button>
      </div>
    );
  };

  const ChooseDateTimeComponent = ({
    label,
    buttonLabel,
    updateDate,
    updateTime,
  }) => {
    return (
      <div className="choose-date-time">
        <h2>{label}</h2>
        <div className="date-time-picker">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="date-picker">
              <h3>Choose Date</h3>
              <StaticDatePicker
                orientation="landscape"
                sx={{
                  width: "100%",
                  height: "100%",
                }}
                onChange={(e) => {
                  console.log("Date changed -> ", e.toDate());
                }}
              />
            </div>
            <div className="time-picker">
              <h3>Choose Time</h3>
              <StaticTimePicker
                onChange={(e) => {
                  console.log("Time changed -> ", e.toDate());
                }}
                sx={{
                  alignSelf: "left",
                }}
                orientation="landscape"
              />
            </div>
          </LocalizationProvider>
        </div>
        <Button variant="contained" color="success" onClick={() => {}}>
          {buttonLabel}
        </Button>
      </div>
    );
  };

  const handleBackArrowOp = () => {
    setExamCreationPhase((prev) => Math.max(prev - 1, 0));
  };

  if (true) {
    let componentHolder = "Error";
    let iconType = "Back";
    if (examCreationPhase === EXAM_CREATION_PHASE.INTRO) {
      iconType = "Home";
      componentHolder = (
        <div className="exam-flow">
          <h1>Exam Creation</h1>
          <h2>
            Create exams for any subject and mode, tailored to your students'
            needs. The test will appear on the students' dashboard with the
            specified timings and will be accessible when the scheduled time
            arrives.
          </h2>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              callSetStateWithBackdrop(() =>
                setExamCreationPhase(EXAM_CREATION_PHASE.CHOOSE_SUBJECT)
              );
            }}
          >
            Get Started
          </Button>
        </div>
      );
    } else if (examCreationPhase === EXAM_CREATION_PHASE.CHOOSE_SUBJECT) {
      componentHolder = (
        <ChooseSubjectComponent
          subjectList={getList()}
          selectedSubject={subject}
          updateSelectedSubject={set_Subject}
        />
      );
    } else if (examCreationPhase === EXAM_CREATION_PHASE.CHOOSE_MODE) {
      componentHolder = (
        <ChooseExamModeComponent
          examMode={ExamTakingMode}
          updateExamMode={set_Mode}
        />
      );
    } else if (examCreationPhase === EXAM_CREATION_PHASE.CHOOSE_DATE_TIME) {
      componentHolder = (
        <ChooseDateTimeComponent
          label={"Choose Start Date & Time"}
          buttonLabel={"Proceed"}
        />
      );
    }
    return (
      <>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={showBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="exam-flow-main-container">
          <div className="exam-flow-navigator">
            {iconType === "Home" ? (
              <HomeIcon onClick={() => (window.location.href = "/")}/>
            ) : (
              <ArrowBackIcon onClick={handleBackArrowOp} />
            )}
          </div>
          {componentHolder}
        </div>
      </>
    );
  }

  return (
    <div className="examDetails">
      <div className="exMD_title">
        <h1> Exam Details </h1>
      </div>
      <div className="exD_1">
        <Dropdown
          label={"Choose Subject"}
          itemList={getList()}
          valueHandler={[subject, set_Subject]}
        />
      </div>
      <div className="exD_mode">
        <Dropdown
          label={"Mode of Exam"}
          itemList={["Typed", "Hand Written(via image upload)"]}
          valueHandler={[ExamTakingMode, set_Mode]}
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
