import React from "react";
import "./ErrorBox.css";
import Alert from "../../assets/Images/alert.svg";
import Close from "../../assets/icons/close.svg";

const ErrorBox = ({ info }) => {
  return (
    <div className="errorBX">
      <div className="erBx_1">
        <img src={Alert} alt="!!" />
        <h2>{info}</h2>
      </div>
      <img src={Close} alt="x" />
    </div>
  );
};

export default ErrorBox;
