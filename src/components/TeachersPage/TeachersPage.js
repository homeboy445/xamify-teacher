import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../Context";
import Card from "../sub_components/Card/Card";
import AddUserBox from "../sub_components/AddUserBox/AddUserBox";

const TeachersPage = () => {
  const Main = useContext(AuthContext);
  const [DetailBox, toggle_DBx] = useState(false);
  const [teachers, set_teachers] = useState([
    { name: "", course: "", year: "" },
  ]);
  const [displayList, update_List] = useState(teachers);
  const [searchQuery, update_Query] = useState("");
  const [fetchStatus, update_Status] = useState(false);

  useEffect(() => {
    if (Main.AccessToken !== null && !fetchStatus) {
      Main.toggleLoader(true);
      axios
        .get(Main.url + "/teachers", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          let obj = response.data;
          for (var i = 0; i < response.data.length; i++) {
            if (obj[i].email === Main.userInfo.email) {
              obj.splice(i, 1);
              break;
            }
          }
          set_teachers(obj);
          update_Status(true);
          Main.toggleLoader(false);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
    let obj = [];
    if (!searchQuery) {
      return update_List(teachers);
    }
    for (const key of teachers) {
      if (key.Name.includes(searchQuery)) {
        obj.push(key);
      }
    }
    update_List(obj);
  }, [teachers, searchQuery, Main]);

  return (
    <div className="stud-page">
      <AddUserBox //Restrict this feature to admin only...
        DetailBox={DetailBox}
        title={"Add a new Teacher"}
        type="teacher"
        closeBox={() => {
          toggle_DBx(false);
        }}
        onSubmitCallback={(name, email, password) => {
          axios
            .post(
              Main.url + "/teachers",
              {
                name: name,
                email: email,
                password: password,
              },
              {
                headers: { Authorization: Main.AccessToken },
              }
            )
            .then((response) => {
              toggle_DBx(false);
              return;
            })
            .catch((err) => {
              Main.RefreshAccessToken();
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
        <h1 className="s-title">Teachers</h1>
        <button
          onClick={() => {
            toggle_DBx(!DetailBox);
          }}
        >
          Add Teacher +{" "}
        </button>
      </div>
      <div className="st_2">
        <div className="st_2_1">
          <input
            type="text"
            placeholder="Search Teacher"
            value={searchQuery}
            onChange={(e) => {
              update_Query(e.target.value);
            }}
            disabled={teachers.length === 0}
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
              item.name =
                item.name === null || item.name === undefined
                  ? "Admin"
                  : item.name;
              return (
                <Card
                  key={index}
                  image={`https://avatars.dicebear.com/api/initials/${item.name}.svg`}
                  Name={item.name}
                  Subjects={[]}
                  Creds={[item.course, item.year]}
                />
              );
            })
          ) : (
            <h1 className="st-nfnd">
              {teachers.length === 0
                ? "Record's Empty!"
                : "No teacher with this name exists."}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;
