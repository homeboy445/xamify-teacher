import React, { useState, useEffect, useContext } from "react";
import "./StudentsPage.css";
import axios from "axios";
import Card from "../sub_components/Card/Card";
import AuthContext from "../../Context";
import AddUserBox from "../sub_components/AddUserBox/AddUserBox";

const StudentsPage = () => {
  const Main = useContext(AuthContext);
  const [DetailBox, toggle_DBx] = useState(false);
  const [students, set_students] = useState([]);
  const [displayList, update_List] = useState(students);
  const [searchQuery, update_Query] = useState("");
  const [fetchStatus, update_Status] = useState(false);

  useEffect(() => {
    if (Main.AccessToken !== null && !fetchStatus) {
      axios
        .get(Main.url + "/students", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          set_students(response.data);
          update_Status(true);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
    let obj = [];
    if (!searchQuery) {
      return update_List(students);
    }
    for (const key of students) {
      if (key.name.includes(searchQuery)) {
        obj.push(key);
      }
    }
    update_List(obj);
  }, [students, searchQuery]);

  return (
    <div className="stud-page">
      <AddUserBox
        DetailBox={DetailBox}
        title={"Add a new Student"}
        type="student"
        closeBox={() => {
          toggle_DBx(false);
        }}
        onSubmitCallback={(student) => {
          axios
            .post(
              Main.url + "/students",
              {
                'email': student.email,
                'name': student.name,
                'rollNo': student.rollNo,
                'dob': student.dob,
                'yearId': student.yearId,
                'courseId': student.courseId,
              },
              {
                headers: { Authorization: Main.AccessToken },
                "content-type": "application/json",
              }
            )
            .then((response) => {
              console.log(response.data);
              toggle_DBx(false);
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
        <h1 className="s-title">Students</h1>
        <button
          onClick={() => {
            toggle_DBx(!DetailBox);
          }}
        >
          Add Student +{" "}
        </button>
      </div>
      <div className="st_2">
        <div className="st_2_1">
          <input
            type="text"
            placeholder="Search Student"
            value={searchQuery}
            onChange={(e) => {
              update_Query(e.target.value);
            }}
          />
        </div>
        <div
          className="st_2_2"
          style={{
            pointerEvents: DetailBox ? "none" : "all",
            opacity: DetailBox ? 0.5 : 1,
          }}
        >
          {displayList.length > 0 ? (
            displayList.map((item, index) => {
              return (
                <Card
                  key={index}
                  image={`https://avatars.dicebear.com/api/human/${index}.svg`}
                  Name={item.name}
                  Creds={[item.profile.course.name, item.profile.year.label]}
                  Subjects={[]}
                />
              );
            })
          ) : (
            <h1 className="st-nfnd">No student with this name exists.</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
