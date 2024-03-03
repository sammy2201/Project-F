import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adminlogin from "./pages/Adminlogin";
import Adminregister from "./pages/Adminregister";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Axios from "axios";
import Uploadquiz from "./pages/Uploadquiz";

export const App = () => {
  // const [data, setdata] = useState("");
  // const getData = async () => {
  //   const response = await Axios.get("http://localhost:3001/getData");
  //   setdata(response.data);
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/adminlogin" element={<Adminlogin />} />
          <Route path="/adminregister" element={<Adminregister />} />
          <Route path="/quiz/*" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/uploadquiz" element={<Uploadquiz />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
