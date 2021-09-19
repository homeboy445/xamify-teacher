import React, { useState } from "react";
import "./SignIn.css";
import axios from "axios";
import Cookie from "js-cookie";
import InputBox from "../sub_components/InputBox/InputBox";

const SignIn = ({ changeAuth }) => {
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");

  const RefreshAccessToken = (token) => {
    setTimeout(() => {
      axios
        .post("https://xamify.herokuapp.com/api/auth/token", {
          token: token,
        })
        .then((response) => {
          let cookieValue = Cookie.get("teacher");
          cookieValue = cookieValue === "undefined" ? undefined : cookieValue;
          if (cookieValue === undefined) {
            return;
          }
          Cookie.set('teacher', response.data.accessToken);
          RefreshAccessToken(response.data.refreshToken);
        });
    }, 12 * 60 * 1000); //Refresh after every 12 minutes.
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://xamify.herokuapp.com/api/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        Cookie.set("teacher", response.data.accessToken);
        changeAuth({ status: true });
        RefreshAccessToken(response.data.refreshToken);
      })
      .catch((err) => {
        return;
      });
  };

  return (
    <form className="sgIn" onSubmit={HandleSubmit}>
      <div className="sg-1">
        <h1>Sign In to your account.</h1>
        <h2>And get the most of Xamify.</h2>
      </div>
      <div className="sg-2">
        <InputBox
          type="email"
          placeholder="Email"
          value={email}
          onChangeCallback={(e) => set_email(e.target.value.trim())}
        />
        <InputBox
          type="password"
          placeholder="Password"
          value={password}
          onChangeCallback={(e) => set_password(e.target.value.trim())}
        />
      </div>
      <button className="sg-btn">SignIn</button>
    </form>
  );
};

export default SignIn;
