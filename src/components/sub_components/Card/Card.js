import React, { useContext } from "react";
import AuthContext from "../../../Context";
import "./Card.css";

const Card = ({ image, Name, Creds, type, callBack, removeCallback }) => {
  const Main = useContext(AuthContext);
  type = typeof type === undefined ? "all" : "course";
  callBack = typeof callBack === undefined ? () => {} : callBack;
  removeCallback =
    typeof removeCallback === undefined ? () => {} : removeCallback;
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
        <div
          className="crd_1"
          style={{
            opacity: Main.userInfo.email !== "admin@xamify.com" ? 0 : 1,
            pointerEvents:
              Main.userInfo.email !== "admin@xamify.com" ? "none" : "all",
          }}
        >
          <h3 onClick={callBack}>edit</h3>
          <h3 onClick={removeCallback}>remove</h3>
        </div>
      </div>
    </div>
  );
};

export default Card;
