import React from "react";
import "./Card.css";

const Card = ({ image, Name, Creds, type, Subjects }) => {
  type = typeof type === undefined ? "all" : "course";
  return (
    <div className="prof-card">
      {type === "course" ? (
        <div className="pf-img">
          <img src={image} alt="" />
        </div>
      ) : null}
      <div className="pf_1">
        <h2>{Name}</h2>
        {Creds.map((item, index) => {
          return <h3 key={index}>{item}</h3>;
        })}
        {type === "course" ? (
          <div className="crd_subjects">
            {typeof Subject !== undefined
              ? Subjects.map((item, index) => {
                  return (
                    <div className="crd_sub_1">
                      <h2>{index + 1} year</h2>
                      <ul>
                        {item[index + 1].map((i, idx) => {
                          return <li key={idx}>{i}</li>;
                        })}
                      </ul>
                    </div>
                  );
                }):null}
          </div>
        ) : null}
        <div className="crd_1">
          <h3>edit</h3>
          <h3>remove</h3>
        </div>
      </div>
    </div>
  );
};

export default Card;
