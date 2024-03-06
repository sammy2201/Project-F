import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Ournavbar from "../Components/Ournavbar";
import "../CSS/Home.css";
import Axios from "axios";
import Quiztitlecard from "../Components/Quiztitlecard";

const Home = () => {
  const [typeOfUser_inserver, settypeOfUser_inserver] = useState("");
  const [quiz, setquiz] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/");
        console.log("user login info ", response.data);
        console.log("Quiz details", quiz);
        settypeOfUser_inserver(response.data.typeOfUser_inserver);
        setquiz(response.data.quiz);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Ournavbar typeOfUser_inserver={typeOfUser_inserver} />
      <h2 className="mainheading">
        Quizzes that inspire, enlighten, and transform curiosity into wisdom.
        Unlock knowledge, one question at a time
      </h2>

      {/* <div className="imagediv">
        <img className="mainimage" src={require("../images/education.svg")} />
      </div> */}
      <Quiztitlecard quizarray={quiz} />
      <Footer />
    </div>
  );
};

export default Home;
