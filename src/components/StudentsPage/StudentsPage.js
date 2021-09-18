import React, { useState, useEffect } from "react";
import "./StudentsPage.css";
import Card from "../sub_components/Card/Card";
import AddUserBox from "../sub_components/AddUserBox/AddUserBox";

const StudentsPage = () => {
  const [DetailBox, toggle_DBx] = useState(false);
  const [students, set_students] = useState([
    {
      Name: "Will Smith",
      course: "Computer Science",
      year: "2nd year",
    },
    {
      Name: "Ray palmer",
      course: "Mathematics",
      year: "3rd year",
    },
    {
      Name: "Tony Stark",
      course: "Physics",
      year: "4th year",
    },
    {
      Name: "Bruce Banner",
      course: "Physics",
      year: "1st year",
    },
    {
      Name: "Damian Wayne",
      course: "Applied Sciences",
      year: "1st year",
    },
  ]);
  const [displayList, update_List] = useState(students);
  const [searchQuery, update_Query] = useState("");

  useEffect(() => {
    let obj = [];
    if (!searchQuery) {
      return update_List(students);
    }
    for (const key of displayList) {
      if (key.Name.includes(searchQuery)) {
        obj.push(key);
      }
    }
    update_List(obj);
  }, [searchQuery]);

  return (
    <div className="stud-page">
      <AddUserBox
        DetailBox={DetailBox}
        title={"Add a new Student"}
        type="student"
        closeBox={()=>{
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
                  Name={item.Name}
                  Creds={[item.course, item.year]}
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
