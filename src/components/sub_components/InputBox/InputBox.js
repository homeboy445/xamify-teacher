import React from "react";
import "./InputBox.css";
import user from "../../../assets/icons/user.svg";
import email from "../../../assets/icons/email.svg";
import password from "../../../assets/icons/password.svg";
import rollno from "../../../assets/icons/rollno.svg";
import study from "../../../assets/icons/study.png";

const InputBox = ({ placeholder, type, onChangeCallback, value }) => {
  return (
    <div className="inputbx">
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChangeCallback}
        value={value}
        required
      />
      <img
        src={
          type === "email"
            ? email
            : type === "text"
            ? placeholder === "Roll Number"
              ? rollno
              : placeholder === "First Name" || placeholder === "Second Name"
              ? user
              : study
            : password
        }
        alt={type}
      />
    </div>
  );
};

export default InputBox;
