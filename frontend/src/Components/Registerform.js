import React, { useState } from "react";
import "../CSS/Loginform.css";

const Registerform = (props) => {
  const [userId, setuserId] = useState("");
  const [pass, setpass] = useState("");
  const [name, setname] = useState("");

  const username = (e) => {
    setuserId(e.target.value);
  };
  const password = (e) => {
    setpass(e.target.value);
  };
  const namefun = (e) => {
    setname(e.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    props.submit(userId, pass, name);
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md">
            <form className="Formmain" action="POST">
              <input
                htmlFor="email"
                type="email"
                name="username"
                onChange={username}
                placeholder="Email"
                autoFocus
              />
              <br />
              <input
                htmlFor="password"
                type="text"
                name="name"
                onChange={namefun}
                placeholder="Your name"
              />
              <br />
              <input
                htmlFor="password"
                type="password"
                name="password"
                onChange={password}
                placeholder="Password"
              />
              <br />
              <input
                className="btn-sub"
                type="submit"
                value="Sign in"
                onClick={submit}
              />
              <br />
            </form>
          </div>
          <div className="col-md">
            <img className="image" src={require("../images/login.svg")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerform;
