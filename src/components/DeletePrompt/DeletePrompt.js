import React from "react";
import "./DeletePrompt.css";

const DeletePrompt = ({ message, callback, closeCallback }) => {
  return (
    <div className="del_msg">
      <h1>{message || "Are you sure?"}</h1>
      <div>
        <button
          onClick={() => {
            callback();
            closeCallback();
          }}
        >
          Yes, I'm sure
        </button>
        <button
          onClick={() => {
            closeCallback();
          }}
        >
          No, it was a mistake
        </button>
      </div>
    </div>
  );
};

export default DeletePrompt;
