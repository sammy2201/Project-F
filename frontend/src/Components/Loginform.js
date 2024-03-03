import React, { useState } from "react";
import "../CSS/Loginform.css"; // Make sure to adjust the path to your CSS file

const Loginform = (props) => {
  const [userId, setuserId] = useState("");
  const [pass, setpass] = useState("");

  const username = (e) => {
    setuserId(e.target.value);
  };
  const password = (e) => {
    setpass(e.target.value);
  };

  async function submit(e) {
    e.preventDefault();
    props.submit(userId, pass);
  }

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
                value={userId}
                onChange={username}
                placeholder="Email"
                autoFocus
              />
              <br />
              <input
                htmlFor="password"
                type="password"
                name="password"
                value={pass}
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

export default Loginform;
