import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../Context";
import Card from "../sub_components/Card/Card";
import AddUserBox from "../sub_components/AddUserBox/AddUserBox";
import DeletePrompt from "../DeletePrompt/DeletePrompt";

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
  const [fetchedResources, update_Status] = useState(false);
  const [DeletePromptBox, toggleDelPrmpt] = useState({ is: false, id: null });

  const getMaxYear = (year) => {
    let mxAr = [0];
    try {
      year.map((item) => {
        let s = item.label;
        for (var i = 0; i < s.length; i++) {
          if (!isNaN(s[i])) {
            mxAr.push(parseInt(s[i]));
          }
        }
        return null;
      });
    } catch {
      mxAr = [0];
    }
    let mx = 0;
    mxAr.map((item) => {
      if (!isNaN(item)) {
        mx = Math.max(mx, item);
      }
      return null;
    });
    return mx;
  };

  useEffect(() => {
    if (Main.accessToken !== null && !fetchedResources) {
      Main.toggleLoader(true);
      axios
        .get(Main.url + "/courses/subjects/all", {
          headers: {
            Authorization: Main.AccessToken,
          },
        })
        .then((response) => {
          set_course(response.data);
          update_List(response.data);
          update_Status(true);
          Main.toggleLoader(false);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
    let obj = [];
    if (!searchQuery) {
      return update_List(course);
    }
    for (const key of displayList) {
      if (key.name.includes(searchQuery)) {
        obj.push(key);
      }
    }
    update_List(obj);
  }, [course, searchQuery]);

  return (
    <div className="stud-page">
      {DeletePromptBox.is ? (
        <DeletePrompt
          message={"Are you sure about deleting this course?"}
          callback={() => {
            axios
              .delete(Main.url + `/courses/${DeletePromptBox.id}`, {
                headers: { Authorization: Main.AccessToken },
              })
              .then((response) => {
                window.location.href = "/coursepage";
              })
              .catch((err) => {
                Main.toggleErrorBox({
                  is: true,
                  info: "Delete Operation failed. Try again later.",
                });
              });
          }}
          closeCallback={() => toggleDelPrmpt(false)}
        />
      ) : null}
      <AddUserBox
        DetailBox={DetailBox}
        title={"Add a new Course"}
        type="course"
        closeBox={() => {
          toggle_DBx(false);
        }}
        onSubmitCallback={(name) => {
          axios
            .post(
              Main.url + "/courses",
              { name: name.trim() },
              {
                headers: { Authorization: Main.AccessToken },
              }
            )
            .then((response) => {
              window.location.href = "/coursepage";
            })
            .catch((err) => {
              Main.RefreshAccessToken();
              Main.toggleErrorBox({
                is: true,
                info: "An error occured while adding new course. Operation unsuccessful.",
              });
            });
        }}
      />
      <div
        className="stud-title"
        style={{
          pointerEvents: DetailBox || DeletePromptBox.is ? "none" : "all",
          opacity: DetailBox || DeletePromptBox.is ? 0.5 : 1,
        }}
      >
        <h1 className="s-title">Courses</h1>
        <button
          onClick={() => {
            toggle_DBx(!DetailBox);
          }}
          style={{
            opacity: Main.userInfo.email !== "admin@xamify.com" ? 0 : 1,
            pointerEvents:
              Main.userInfo.email !== "admin@xamify.com" ? "none" : "all",
          }}
        >
          Add Course +
        </button>
      </div>
      <div className="st_2">
        <div className="st_2_1">
          <input
            type="text"
            placeholder="Search Courses"
            value={searchQuery}
            onChange={(e) => {
              update_Query(e.target.value);
            }}
            disabled={course.length === 0}
          />
        </div>
        <div
          className="st_2_2"
          style={{
            pointerEvents: DetailBox || DeletePromptBox.is ? "none" : "all",
            opacity: DetailBox || DeletePromptBox.is ? 0.5 : 1,
          }}
        >
          {displayList.length > 0 ? (
            displayList.map((item, index) => {
              return (
                <Card
                  key={index}
                  type="course"
                  image={Main.getCourseImageUrl(item.name)}
                  Name={item.name}
                  Creds={[`${getMaxYear(item.years)} year course`]}
                  callBack={() => {
                    window.location.href = `/coursedetails/${item.id}`;
                  }}
                  removeCallback={() => {
                    toggleDelPrmpt({ is: true, id: item.id });
                  }}
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
