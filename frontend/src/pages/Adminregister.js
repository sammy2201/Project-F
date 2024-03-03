import React from "react";
import Ournavbar from "../Components/Ournavbar";
import Registerform from "../Components/Registerform";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Adminregister = () => {
  const history = useNavigate();
  const getdata = async (username, password, name) => {
    console.log("This data is comming", username, password, name);
    try {
      const response = await Axios.post("http://localhost:3001/adminregister", {
        username: username,
        password: password,
        name: name,
      }).then((res) => {
        if (res.data === "OK") {
          history("/");
        }
      });
      console.log("Login response:", response.data);
    } catch (error) {
      console.error("Error sending login request:", error);
    }
  };
  return (
    <div>
      <Ournavbar />
      <h1 className="admin-h1">Register as Tutor</h1>
      <Registerform submit={getdata} />
    </div>
  );
};

export default Adminregister;
