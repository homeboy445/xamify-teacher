import React, { useState, useEffect, useContext } from "react";
import "./CoursePage.css";
import AddUserBox from "../sub_components/AddUserBox/AddUserBox";
import axios from "axios";
import AuthContext from "../../Context";

const CourseDetail = (props) => {
  const Main = useContext(AuthContext);
  const [DetailBox, toggle_DBx] = useState(false);
  const [courseDetails, update_Details] = useState([
    {
      id: "....",
      label: "Failed to load",
      subjects: [
        {
          id: "...",
          name: "Failed to load",
          yearId: "...",
          courseId: "...",
        },
      ],
    },
  ]);
  const [fetchedData, update_Status] = useState(false);
  const courseId = props.match.params.id;
  const colorData = [
    {
      color: "white",
      background: "#59b2e5",
    },
    {
      color: "white",
      background: "#db4a42",
    },
    {
      color: "rgb(116, 116, 116)",
      background: "#f6cfc5",
    },
    {
      color: "white",
      background: "#5dc185",
    },
    {
      color: "white",
      background: "#224c67",
    },
  ];

  const sortDataYearwise = (yearData) => {
    let obj = { 1: [], 2: [], 3: [], 4: [] };
    try {
      yearData.map((item) => {
        let s = item.label;
        for (var i = 0; i < s.length; i++) {
          if (!isNaN(s[i])) {
            obj[parseInt(s[i])] = item;
            break;
          }
        }
        return null;
      });
    } catch {
      return ["No year Associated"];
    }
    return [obj[1], obj[2], obj[3], obj[4]];
  };

  const getRandomArbitrary = (min, max) => {
    return Math.ceil(Math.random() * (max - min) + min);
  };

  useEffect(() => {
    if (Main.AccessToken !== null && !fetchedData) {
      axios
        .get(Main.url + "/courses/subjects/all", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          let obj = response.data.find((item) => item.id === courseId);
          if (typeof obj === undefined) {
            return;
          }
          update_Details([obj]);
          update_Status(true);
          sortDataYearwise(courseDetails[0].years);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
  }, [courseDetails, Main]);

  return (
    <div className="stud-page">
      <AddUserBox
        DetailBox={DetailBox}
        title={"Add a new subject and associate it with a course and a year."}
        type="subject"
        closeBox={() => {
          toggle_DBx(false);
        }}
        onSubmitCallback={(name, coursId, yearId) => {
          if (name.trim() === "") {
            return;
          }
          Main.toggleLoader(true);
          axios
            .post(
              Main.url + "/subjects",
              {
                name: name,
                yearId: yearId,
                courseId: coursId,
              },
              {
                headers: { Authorization: Main.AccessToken },
              }
            )
            .then((response) => {
              if (courseId === coursId) {
                window.location.href = `/coursedetails/${courseId}`;
              }
              toggle_DBx(false);
              Main.toggleLoader(false);
            })
            .catch((err) => {
              Main.toggleErrorBox({
                is: true,
                info: "An error occured while adding new subject. Operation unsuccessful.",
              });
            });
        }}
      />
      <div
        className="stud-title"
        style={{
          pointerEvents: DetailBox ? "none" : "all",
          opacity: DetailBox ? 0.5 : 1,
        }}
      >
        <h1 className="s-title">{courseDetails[0].name}</h1>
        <button
          onClick={() => {
            toggle_DBx(!DetailBox);
          }}
        >
          Add Subject +
        </button>
      </div>
      <div>
        {typeof courseDetails[0].years !== undefined ? (
          <div className="yrs_subj">
            {(
              sortDataYearwise(courseDetails[0].years) || ["No Year Associated"]
            ).map((item, index) => {
              return (
                <div key={index}>
                  <h2>{item.label}</h2>
                  <div className="subjects">
                    {(item.subjects || []).length > 0
                      ? (item.subjects || ["No Subject Associated"]).map(
                          (item, index) => {
                            let idx = getRandomArbitrary(0, colorData.length),
                              N = colorData.length;
                            return (
                              <p
                                key={index}
                                style={{
                                  color: colorData[idx % N].color,
                                  background: colorData[idx % N].background,
                                }}
                              >
                                {item.name || "No Subject Associated"}
                              </p>
                            );
                          }
                        )
                      : "No Subject Associated"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CourseDetail;
