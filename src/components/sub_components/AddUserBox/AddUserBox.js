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
    courseList.map((item) => {
      if (item.name === course) {
        id = item.id;
      }
      return null;
    });
    return id;
  };

  const getYearId = (year) =>{
    let id = '';
    yearList.map((item) => {
      if (item.name === year) {
        id = item.id;
      }
      return null;
    });
    return id;
  }

  const getDob = (date, delimiter = '-') => {
    var dateObj = new Date();
    let d_Obj = date.split(delimiter);
    if (delimiter === '/'){
      let t = d_Obj[2];
      d_Obj[2] = d_Obj[0];
      d_Obj[0] = t;
    }
    console.log(date, ' ', d_Obj);
    dateObj.setFullYear(
      parseInt(d_Obj[0]),
      parseInt(d_Obj[1]),
      parseInt(d_Obj[2])
    );
    dateObj.setHours(0);
    dateObj.setMinutes(0);
    dateObj.setSeconds(0);
    return dateObj.toISOString();
  };

  useEffect(() => {
    axios
      .get(Main.url + "/courses", {
        headers: { Authorization: Main.AccessToken },
      })
      .then((response) => {
        update_clist(response.data);
        axios
          .get(Main.url + "/years", {
            headers: { Authorization: Main.AccessToken },
          })
          .then((response) => {
            update_ylist(response.data);
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
        {type !== "teacher" ? (
          <button
            onClick={() => {
              change_AType((ActiveType + 1) % 2);
            }}
          >
            {" "}
            {ActiveType === 0 ? "Multiple" : "Indivisual"}{" "}
          </button>
        ) : null}
      </div>
      {ActiveType === 0 || type === "teacher" ? (
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
          {ActiveType === 0 ? (
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
          ) : (
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
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    let c = e.target.result;
                    csvToJson()
                      .fromString(c)
                      .then((response) => {
                        let student = [];
                        response.map((item) => {
                          console.log(item);
                          student.push([
                            {
                              name: item.FirstName + item.SecondName,
                              email: item.email,
                              password: item.email + "&&1223",
                              rollNo: item.rollNo,
                              dob: getDob(item.dob, '/'),
                              yearId: getYearId(item.year),
                              courseId: getCourseId(item.course),
                            },
                          ]);
                          return null;
                        });
                        console.log(student);
                        changeCurCsv(student);
                      });
                  };
                  reader.readAsBinaryString(e.target.files[0]);
                }}
              />
            </div>
          )}
        </div>
      )}
      <div className="inf_btns">
        <button
          className="add_usr_btn"
          onClick={() => {
            if (type === "teacher") {
              onSubmitCallback(email, `${email}@1234`);
            } else {
              let studObj = {
                name: firstName + secondName,
                email: email,
                password: email + "&&1223",
                rollNo: rollNo,
                dob: getDob(),
                yearId: getYearId(year),
                courseId: getCourseId(course),
              };
              if (ActiveType === 0){
                onSubmitCallback(studObj);
              }else{
                onSubmitCallback(csvData);
              }
            }
          }}
        >
          Add {type}
          {ActiveType === 1 ? "s" : null}
        </button>
        <button onClick={closeBox}>Cancel</button>
      </div>
    </div>
  );
};

export default AddUserBox;
