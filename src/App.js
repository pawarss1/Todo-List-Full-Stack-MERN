import "./App.css";
import Login from "./Login/Login";
import React, { useState, useEffect } from "react";
import TodoList from "./TodoList/TodoList.jsx";

function App() {
  let [userLoggedIn, setLoginFlag] = useState(false);
  let [errorMsg, setErrorMsg] = useState("");
  let [userEmail, setUserEmail] = useState("");

  const getUserIfLoggedIn = () => {
    fetch("https://todo-node-backend-x.herokuapp.com/userInfo", { credentials: "include" })
      .then((r) => r.json())
      .then((r) => {
        if (r.loggedIn) {
          setUserEmail(r.userEmail);
          setLoginFlag(true);
          setErrorMsg("");
        } else {
          setUserEmail("");
          setLoginFlag(false);
          setErrorMsg("");
        }
      });
  };
  useEffect(() => {
    getUserIfLoggedIn();
  }, []);

  const isNullOrUndefined = (val) => {
    return val === null || val === undefined || val === "";
  };
  const logoutHandler = () => {
    fetch("https://todo-node-backend-x.herokuapp.com/logOut", { credentials: "include" })
      .then((r) => r.json())
      .then((r) => {
        setUserEmail("");
        setLoginFlag(false);
        setErrorMsg("");
      });
  };
  const loginHandler = (userEmail, userPassword) => {
    fetch("https://todo-node-backend-x.herokuapp.com/login", {
      method: "POST",
      body: JSON.stringify({ userEmail: userEmail, password: userPassword }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.loginSuccess) {
          setUserEmail(userEmail);
          setLoginFlag(true);
          setErrorMsg("");
        } else {
          setErrorMsg(r.errorMsg);
          setLoginFlag(false);
        }
      });
  };
  const signUpHandler = (userEmail, userPassword) => {
    fetch("https://todo-node-backend-x.herokuapp.com/signUp", {
      method: "POST",
      body: JSON.stringify({ userEmail: userEmail, password: userPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.signSuccess) {
          setUserEmail(userEmail);
          setLoginFlag(true);
          setErrorMsg("");
        } else {
          setErrorMsg(r.errorMsg);
          setLoginFlag(false);
        }
      });
  };
  return (
    <div className="container">
      {!userLoggedIn && (
        <Login
          loginHandler={loginHandler}
          signUpHandler={signUpHandler}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      )}
      {userLoggedIn && (
        <TodoList
          userEmail={userEmail}
          isNullOrUndefined={isNullOrUndefined}
          logoutHandler={logoutHandler}
        />
      )}
    </div>
  );
}

export default App;
