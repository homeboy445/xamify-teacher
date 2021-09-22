import React, { useState, useEffect, useContext } from "react";
import "./AddUserBox.css";
import axios from "axios";
import csvToJson from "csvtojson";
import InputBox from "../InputBox/InputBox";
import Dropdown from "../Dropdown/Dropdown";
import CSV from "../../../assets/template.csv";
import AuthContext from "./../../../Context";

const AddUserBox = ({ DetailBox, title, type, closeBox, onSubmitCallback }) => {
  const Main = useContext(AuthContext);
  const [firstName, set_fName] = useState("");
  const [secondName, set_SName] = useState("");
  const [email, set_Email] = useState("");
  const [course, set_Course] = useState("Choose course");
  const [csvData, set_csvData] = useState([]);
  const [courseList, update_clist] = useState([
    "Comp.Sci.",
    "Math",
    "Physics",
    "Chemistry",
  ]);
  const [yearList, update_ylist] = useState([
    "1st year",
    "2nd year",
    "3rd year",
    "4th year",
  ]);
  const [year, set_Year] = useState("Choose year");
  const [rollNo, set_RollN] = useState("");
  const [dob, set_dob] = useState("1995-01-01");
  const [curCSV, changeCurCsv] = useState(null);
  const [ActiveType, change_AType] = useState(1);
  const [curSelectedFile, update_File] = useState("");

  const dataToList = (type) => {
    let arr = [];
    if (type === 1) {
      courseList.map((item) => {
        arr.push(item.name);
        return null;
      });
    } else {
      yearList.map((item) => {
        arr.push(item.label);
        return null;
      });
    }
    return arr;
  };

  const getCourseId = (course) => {
    let id = "";
    try {
      id = courseList.find((item) => item.name === course).id;
    } catch {
      id = "";
    }
    return id;
  };

  const getYearId = (year) => {
    let id = "";
    try {
      id = yearList.find((item) => item.label === year).id;
    } catch {
      id = "";
    }
    return id;
  };

  const getDob = (date = "1-1-1", delimiter = "-") => {
    var dateObj = new Date();
    let d_Obj = date.split(delimiter);
    if (delimiter === "/") {
      let t = d_Obj[2];
      d_Obj[2] = d_Obj[0];
      d_Obj[0] = t;
    }
    dateObj.setFullYear(
      parseInt(d_Obj[0]),
      parseInt(d_Obj[1]),
      parseInt(d_Obj[2])
    );
    dateObj.setHours(1, 1, 1);
    return dateObj.toISOString();
  };

  useEffect(() => {
    axios
      .get(Main.url + "/courses", {
        headers: { Authorization: Main.AccessToken },
      })
      .then((response) => {
        update_clist(response.data);
        set_Course(response.data[0].name);
        axios
          .get(Main.url + "/years", {
            headers: { Authorization: Main.AccessToken },
          })
          .then((response) => {
            update_ylist(response.data);
            set_Year(response.data[0].label);
          });
      })
      .catch((err) => {
        Main.RefreshAccessToken();
      });
  }, [Main]);

  return (
    <div
      className="s_box"
      style={{
        transition: "0.5s ease",
        transform: !DetailBox ? "translate(-200%, 0%)" : "translate(-30%, 0%)",
      }}
    >
      <div className="s_box_btns">
        {type === "student" ? (
          <button
            onClick={() => {
              change_AType((ActiveType + 1) % 2);
            }}
          >
            {ActiveType === 0 ? "Multiple" : "Indivisual"}
          </button>
        ) : null}
      </div>
      {type === "course" || type === "subject" || type === "year" ? (
        <div className="crs">
          <h1 className="info_title">{title}</h1>
          {type === "course" ? (
            <h2>
              You can link the subjects and years together with course via
              clicking on edit course.
            </h2>
          ) : type === "year" ? (
            <h2>
              You can link the course and subjects with years via clicking on
              edit course.
            </h2>
          ) : null}
          {type === "subject" ? (
            <div className="usr_drp_down" style={{
              border: 'none'
            }}>
              <Dropdown
                list={dataToList(1)}
                value={course}
                onChangeCallback={(e) => {
                  set_Course(e.target.value);
                }}
              />
              <Dropdown
                list={dataToList(2)}
                value={year}
                onChangeCallback={(e) => {
                  set_Year(e.target.value);
                }}
              />
            </div>
          ) : null}
          <InputBox
            type="text"
            placeholder={
              type === "course" ? "Enter course name" : "Enter subject name"
            }
            onChangeCallback={(e) => {
              set_Email(e.target.value);
            }}
            value={email}
          />
        </div>
      ) : ActiveType === 0 || type === "teacher" ? (
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
                list={dataToList(1)}
                value={course}
                onChangeCallback={(e) => {
                  set_Course(e.target.value);
                }}
              />
              <Dropdown
                list={dataToList(2)}
                value={year}
                onChangeCallback={(e) => {
                  set_Year(e.target.value);
                }}
              />
              <InputBox
                className="dd"
                type="text"
                placeholder="Roll Number"
                onChangeCallback={(e) => {
                  set_RollN(e.target.value.trim());
                }}
                value={rollNo}
              />
              <input
                type="date"
                min="1980-01-01"
                max="2005-12-12"
                value={dob}
                onChange={(e) => {
                  set_dob(e.target.value);
                }}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="bulk_stud">
          <div className="usr_drp_down">
            <Dropdown
              list={dataToList(1)}
              value={course}
              onChangeCallback={(e) => {
                set_Course(e.target.value);
              }}
            />
            <Dropdown
              list={dataToList(2)}
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
                try {
                  update_File(e.target.files[0].name);
                  changeCurCsv(e.target.files[0]);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    let c = e.target.result;
                    csvToJson()
                      .fromString(c)
                      .then((response) => {
                        let student = [];
                        response.map((item) => {
                          student.push({
                            name: item.firstName + " " + item.secondName,
                            email: item.email,
                            rollNo: item.rollNo,
                            dob: getDob(item.dob, "/"),
                            yearId: getYearId(year),
                            courseId: getCourseId(course),
                          });
                          return null;
                        });
                        changeCurCsv(student);
                      });
                  };
                  reader.readAsBinaryString(e.target.files[0]);
                } catch {
                  Main.toggleErrorBox({
                    is: true,
                    info: "Some Error occured. Try again later.",
                  });
                }
              }}
            />
          </div>
          {curSelectedFile !== "" ? (
            <h2 className="sel_fl">
              Selected file: <span>{curSelectedFile}</span>
            </h2>
          ) : null}
        </div>
      )}
      <div className="inf_btns">
        <button
          className="add_usr_btn"
          onClick={() => {
            switch (type) {
              case "teacher": {
                onSubmitCallback(
                  firstName + " " + secondName,
                  email,
                  `${email}@1234`
                );
                break;
              }
              case "student": {
                let studObj = {
                  name: firstName + " " + secondName,
                  email: email,
                  rollNo: rollNo,
                  dob: getDob(dob),
                  yearId: getYearId(year),
                  courseId: getCourseId(course),
                };
                if (ActiveType === 0) {
                  onSubmitCallback(studObj, "/students");
                } else {
                  onSubmitCallback({ students: curCSV }, "/students/bulk");
                }
                update_File("");
                break;
              }
              case "course": {
                onSubmitCallback(email);
                break;
              }
              case "subject": {
                onSubmitCallback(email, getCourseId(course), getYearId(year));
                break;
              }
              default:
                return;
            }
          }}
        >
          Add {type}
          {ActiveType === 1 && type === "student" ? "s" : null}
        </button>
        <button
          onClick={() => {
            closeBox();
            update_File("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddUserBox;
