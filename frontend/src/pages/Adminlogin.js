import React from "react";
import Ournavbar from "../Components/Ournavbar";
import Loginform from "../Components/Loginform";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Adminlogin = () => {
  const history = useNavigate();
  const getdata = async (username, password) => {
    console.log("This data is comming", username, password);
    try {
      const response = await Axios.post("http://localhost:3001/adminlogin", {
        username: username,
        password: password,
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
      <h1 className="admin-h1">Welcome Back</h1>
      <Loginform submit={getdata} />
    </div>
  );
};

export default Adminlogin;
