import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../Context";
import Cookie from "js-cookie";
import Card from "../sub_components/Card/Card";
import AddUserBox from "../sub_components/AddUserBox/AddUserBox";

const CoursePage = () => {
  const Main = useContext(AuthContext);
  const [DetailBox, toggle_DBx] = useState(false);
  const [course, set_course] = useState([
    {
      course: "Computer Science",
      year: 2,
    },
    {
      course: "Mathematics",
      year: 3,
    },
    {
      course: "Physics",
      year: 4,
    },
    {
      course: "Applied Sciences",
      year: 2,
    },
  ]);
  const [displayList, update_List] = useState(course);
  const [searchQuery, update_Query] = useState("");

  useEffect(() => {
    if (Main.accessToken !== null) {
      axios
        .get("https://xamify.herokuapp.com/api/courses", {
          headers: {
            Authorization: `Bearer ${Main.AccessToken}`,
          }
        })
        .then((response) => {
          console.log(response);
        });
    }
    let obj = [];
    if (!searchQuery) {
      return update_List(course);
    }
    for (const key of displayList) {
      if (key.course.includes(searchQuery)) {
        obj.push(key);
      }
    }
    update_List(obj);
  }, [course, searchQuery, displayList, Main]);

  return (
    <div className="stud-page">
      <AddUserBox
        DetailBox={DetailBox}
        title={"Add a new Teacher"}
        type="teacher"
        closeBox={() => {
          toggle_DBx(false);
        }}
      />
      <div
        className="stud-title"
        style={{
          pointerEvents: DetailBox ? "none" : "all",
          opacity: DetailBox ? 0.5 : 1,
        }}
      >
        <h1 className="s-title">Courses</h1>
        <button
          onClick={() => {
            toggle_DBx(!DetailBox);
          }}
        >
          Add Course +
        </button>
      </div>
      <div className="st_2">
        <div className="st_2_1">
          {course.length !== 0 ? (
            <input
              type="text"
              placeholder="Search Courses"
              value={searchQuery}
              onChange={(e) => {
                update_Query(e.target.value);
              }}
            />
          ) : null}
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
                  type="course"
                  Name={item.course}
                  Creds={[`${item.year} year course`]}
                  Subjects={[
                    { 1: ["sub1", "sub2", "sub3", "sub4", "sub5"] },
                    { 2: ["sub1", "sub2", "sub3", "sub4", "sub5"] },
                    { 3: ["sub1", "sub2", "sub3", "sub4", "sub5"] },
                    { 4: ["sub1", "sub2", "sub3", "sub4", "sub5"] },
                  ]}
                />
              );
            })
          ) : (
            <h1 className="st-nfnd">
              {course.length === 0
                ? "Record's Empty!"
                : "No Course with this name exists."}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
