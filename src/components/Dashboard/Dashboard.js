import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import AuthContext from "../../Context";
import axios from "axios";
import Arrow_Down from "../../assets/Images/arrow-down(white).png";

const Dashboard = () => {
  const Main = useContext(AuthContext);
  const [AssessmentDetails, update_Details] = useState([]);
  const [Show_Active, set_SActive] = useState(true);
  const [Show_Upcoming, set_SUpcoming] = useState(true);
  const [Show_Attempted, set_SAttempted] = useState(true);
  const [shownErrorMessage, set_EMessage] = useState(false);

  const [ActiveTests, set_ActiveTests] = useState([]);
  const [UpcomingTests, set_UpcomingTests] = useState([]);
  const [AttemptedTests, set_AttemptedTests] = useState([]);

  useEffect(() => {
    if (Main.AccessToken !== null && !Main.isError.is) {
      axios
        .get(Main.url + "/assessments", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          set_EMessage(false);
          let At = ActiveTests,
            Up = UpcomingTests,
            Atm = AttemptedTests,
            obj = [];
          response.data.map((item) => {
            if (item.author.email !== Main.userInfo.email) {
              return null;
            }
            let d1 = new Date(item.startTime),
              d2 = new Date(item.endTime);
            let duration = Math.floor((d2 - d1) / 60e3);
            let dN = new Date();
            let diff = Math.floor((d1 - dN) / 60e3); //Subtracting start date with current date
            if (diff > 0) {
              //If the difference is +ve then put into upcoming catg
              Up.push({ ExamName: item.subject.name });
              obj.push({ upcoming: item });
            } else {
              //If not,
              if (duration >= Math.abs(diff)) {
                // Check if it's duration greater...
                At.push({ ExamName: item.subject.name });
                obj.push({ active: item });
              } else {
                //Else do this...
                Atm.push({ ExamName: item.subject.name });
                obj.push({ attempted: item });
              }
            }
            return null;
          });
          set_ActiveTests(At);
          set_UpcomingTests(Up);
          set_AttemptedTests(Atm);
          update_Details(obj);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
          if (shownErrorMessage){
            return;
          }
          set_EMessage(true);
          Main.toggleErrorBox({
            //Might be responsible for a possible loop. !loop
            is: true,
            info: "Some error has occured while fetching assessments",
          });
        });
    }
  }, [Main]);

  return (
    <div className="dashboard">
      <div className="db-titl">
        <h1 className="d-title">Dashboard</h1>
        <button onClick={() => (window.location.href = "/examdetails")}>
          Create Tests +{" "}
        </button>
      </div>
      <div className="dashboard-1">
        <div className="Active">
          <div
            className="Active_1"
            onClick={() => {
              set_SActive(!Show_Active);
            }}
          >
            <h1>Active Tests</h1>
            <img
              src={Arrow_Down}
              alt="\/"
              style={{
                transform: Show_Active ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.1s ease",
              }}
            />
          </div>
          {ActiveTests.map((item, index) => {
            return (
              <div
                key={index}
                className="db-card"
                style={{
                  transform: !Show_Active
                    ? `translate(0%,${-20 - index * 25}%)`
                    : "translate(0%,0%)",
                  opacity: Show_Active ? 1 : 0,
                  marginBottom: Show_Active ? "0%" : "-14%",
                  transition: "0.8s ease",
                  backgroundColor: !Show_Active ? "transparent" : "#cde4f6",
                }}
              >
                <h2>{item.ExamName}</h2>
                <button>Info</button>
              </div>
            );
          })}
        </div>
        <div className="Upcoming">
          <div
            className="Upcoming_1"
            onClick={() => {
              set_SUpcoming(!Show_Upcoming);
            }}
          >
            <h1>Upcoming Tests</h1>
            <img
              src={Arrow_Down}
              alt="\/"
              style={{
                transform: Show_Upcoming ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.1s ease",
              }}
            />
          </div>
          {UpcomingTests.map((item, index) => {
            return (
              <div
                key={index}
                className="db-card"
                style={{
                  transform: !Show_Upcoming
                    ? `translate(0%,${-20 - index * 25}%)`
                    : "translate(0%,0%)",
                  opacity: Show_Upcoming ? 1 : 0,
                  marginBottom: Show_Upcoming ? "0%" : "-17%",
                  transition: "0.8s ease",
                  backgroundColor: !Show_Upcoming ? "transparent" : "#cde4f6",
                }}
              >
                <h2>{item.ExamName}</h2>
                <button>Info</button>
              </div>
            );
          })}
        </div>
        <div className="Attempted">
          <div
            className="Attempted_1"
            onClick={() => {
              set_SAttempted(!Show_Attempted);
            }}
          >
            <h1>Attempted Tests</h1>
            <img
              src={Arrow_Down}
              alt="\/"
              style={{
                transform: Show_Attempted ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.1s ease",
              }}
            />
          </div>
          {AttemptedTests.map((item, index) => {
            return (
              <div
                key={index}
                className="db-card"
                style={{
                  transform: !Show_Attempted
                    ? `translate(0%,${-20 - index * 25}%)`
                    : "translate(0%,0%)",
                  opacity: Show_Attempted ? 1 : 0,
                  marginBottom: Show_Attempted ? "0%" : "-25%",
                  transition: "0.8s ease",
                  backgroundColor: !Show_Attempted ? "transparent" : "#cde4f6",
                }}
              >
                <h2>{item.ExamName}</h2>
                <button>Info</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
