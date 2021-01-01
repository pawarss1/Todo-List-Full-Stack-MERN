import React, { useState } from "react";
import "./login.css";

function Login(props) {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  return (
    <div className="container">
      <div className="login">
        <label>Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(evt) => {
            props.setErrorMsg("");
            setEmail(evt.target.value);
          }}
        ></input>
        <label>Password</label>
        <input
          type="password"
          value={userPassword}
          onChange={(evt) => {
            props.setErrorMsg("");
            setPassword(evt.target.value);
          }}
        ></input>
        <p className="errorMsg">{props.errorMsg}</p>
        <div className="btn-group">
          <button onClick={() => props.loginHandler(userEmail, userPassword)}>Login</button>
          <button onClick={() => props.signUpHandler(userEmail, userPassword)}>SignUp</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
