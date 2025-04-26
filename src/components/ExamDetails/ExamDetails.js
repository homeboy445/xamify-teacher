import React, { useState, useEffect, useContext } from "react";
import Dropdown from "../sub_components/Dropdown/Dropdown";
import AuthContext from "../../Context";
import axios from "axios";
import "./ExamDetails.css";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import DialogBox from "../sub_components/DialogBox/DialogBox";

const EXAM_CREATION_PHASE = {
  INTRO: 0,
  CHOOSE_SUBJECT: 1,
  CHOOSE_MODE: 2,
  CHOOSE_DATE: 3,
  CHOOSE_TIME: 4,
};

const ExamDetails = () => {
  const Main = useContext(AuthContext);
  const [examCreationPhase, setExamCreationPhase] = useState(
    EXAM_CREATION_PHASE.INTRO
  );
  const [subject, set_Subject] = useState("");
  const [subjectList, update_List] = useState([]);
  const [fetchedData, updateStatus] = useState(false);
  const [ExamTakingMode, set_Mode] = useState("");
  const [showBackdrop, toggleBackdrop] = useState(false);
  const [examDate, updateExamDate] = useState(
    dayjs().add(1, "day").startOf("day")
  );
  const [examBeginTime, updateExamBeginTime] = useState(dayjs());
  const [examEndTime, updateExamEndTime] = useState(dayjs().add(2, "hour"));
  const [showExamDetailsDialogBox, toggleShowExamDetailsDialogBox] =
    useState(false);

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

  const createExamWithChoosenDetails = () => {
    debugger;
    const ExamObject = {
      type: ExamTakingMode === "Typed" ? "DIGITAL" : "WRITTEN",
      startTime: examBeginTime.toISOString(),
      endTime: examEndTime.toISOString(),
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
        <h2 id="mainLabel">Choose Subject for Examination</h2>
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
        <h2 id="mainLabel">Choose Exam Mode</h2>
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
            if (examMode.trim()) {
              callSetStateWithBackdrop(() =>
                setExamCreationPhase(EXAM_CREATION_PHASE.CHOOSE_DATE)
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

  const ChooseDateComponent = () => {
    return (
      <div className="date-picker">
        <h2 id="mainLabel">Choose Exam commencement date</h2>
        <div className="date-picker-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Exam date"
              value={examDate}
              onChange={(newValue) => {
                updateExamDate(newValue);
              }}
              minDate={dayjs().add(1, "day").startOf("day")}
            />
          </LocalizationProvider>
        </div>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            callSetStateWithBackdrop(() =>
              setExamCreationPhase(EXAM_CREATION_PHASE.CHOOSE_TIME)
            );
          }}
        >
          Proceed
        </Button>
      </div>
    );
  };

  const ChooseTimePickerComponent = () => {
    return (
      <div className="time-picker">
        <h2 id="mainLabel">Choose Exam timings</h2>
        <div className="time-picker-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Exam begins at"
              value={examBeginTime}
              onChange={(newValue) => {
                const updatedBeginTime = examDate
                  .hour(newValue.hour())
                  .minute(newValue.minute());
                updateExamBeginTime(updatedBeginTime);
                updateExamEndTime(updatedBeginTime.add(1, "hour"));
              }}
            />
            <h3>&</h3>
            <TimePicker
              label="Exam ends at"
              value={examEndTime}
              onChange={(newValue) => {
                const updatedEndTime = examDate
                  .hour(newValue.hour())
                  .minute(newValue.minute());
                updateExamEndTime(updatedEndTime);
              }}
              minTime={examBeginTime.add(1, "hour")}
            />
          </LocalizationProvider>
        </div>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            toggleShowExamDetailsDialogBox(true);
          }}
        >
          Proceed
        </Button>
      </div>
    );
  };

  const getExamDetailsForDialogBox = () => {
    return [
      ["Exam Subject", subject],
      ["Exam Mode", ExamTakingMode],
      ["Exam Date", examDate.format("D MMMM, YYYY")],
      ["Exam Start Time", examBeginTime.format("h:mm A")],
      ["Exam End Time", examEndTime.format("h:mm A")],
    ];
  };

  const handleBackArrowOp = () => {
    setExamCreationPhase((prev) => Math.max(prev - 1, 0));
  };

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
  } else if (examCreationPhase === EXAM_CREATION_PHASE.CHOOSE_DATE) {
    componentHolder = <ChooseDateComponent />;
  } else if (examCreationPhase === EXAM_CREATION_PHASE.CHOOSE_TIME) {
    componentHolder = <ChooseTimePickerComponent />;
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
            <HomeIcon onClick={() => (window.location.href = "/")} />
          ) : (
            <ArrowBackIcon onClick={handleBackArrowOp} />
          )}
        </div>
        {componentHolder}
        <DialogBox
          title={"Exam details"}
          children={getExamDetailsForDialogBox()}
          showDialog={showExamDetailsDialogBox}
          onAcceptCallback={() => {
            createExamWithChoosenDetails();
            toggleShowExamDetailsDialogBox(false);
          }}
          onCloseCallback={() => {
            toggleShowExamDetailsDialogBox(false);
          }}
        />
      </div>
    </>
  );
};

export default ExamDetails;
