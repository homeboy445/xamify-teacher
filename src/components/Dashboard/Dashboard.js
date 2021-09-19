import React, { useState } from "react";
import Arrow_Down from "../../assets/Images/arrow-down(white).png";
import "./Dashboard.css";

const Dashboard = () => {
  const [Show_Active, set_SActive] = useState(true);
  const [Show_Upcoming, set_SUpcoming] = useState(true);
  const [Show_Attempted, set_SAttempted] = useState(true);

  const [ActiveTests, set_ActiveTests] = useState([
    {
      ExamName: "Algorithm Design",
    },
    {
      ExamName: "Mathematics",
    },
    {
      ExamName: "Physics",
    },
  ]);
  const [UpcomingTests, set_UpcomingTests] = useState([
    {
      ExamName: "Data Structures",
    },
  ]);
  const [AttemptedTests, set_AttemptedTests] = useState([
    {
      ExamName: "Discrete Mathematics",
    },
  ]);

  return (
    <div className="dashboard">
      <div className="db-titl">
        <h1 className="d-title">Dashboard</h1>
        <button onClick={
          ()=>window.location.href="/examdetails"
        }>Create Tests + </button>
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
