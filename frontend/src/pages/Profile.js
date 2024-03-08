import React, { useEffect, useState } from "react";
import Axios from "axios";
import Ournavbar from "../Components/Ournavbar";
import Card from "react-bootstrap/Card";
import "../CSS/profile.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Profile() {
  const history = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [userquiz, setuserquiz] = useState([]);
  const [quiz, setquiz] = useState();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getuserinfo");
        console.log("user login info ", response.data.quizdata);
        setname(response.data.nameofuserthatloggedin);
        setemail(response.data.userThatLoggedin);
        setuserquiz(response.data.quizdata);
        setquiz(response.data.quiz);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchdata();
  }, []);

  // Early return to handle loading state
  if (!userquiz || !quiz) {
    return (
      <div>
        <Ournavbar />
        <p>Loading...</p>
      </div>
    );
  }

  async function logoutfun() {
    try {
      const response = await Axios.post("http://localhost:3001/logout", {
        logout: true,
      }).then((res) => {
        if (res.data === "OK") {
          history("/");
        }
      });
    } catch (error) {
      console.error("Error sending login request:", error);
    }
    console.log("you ar about to log out");
  }

  // Group quizzes by their titles after finding corresponding quiz titles
  const groupedQuizzes = userquiz.reduce((acc, quizItem) => {
    const foundQuiz = quiz.find((q) => q._id === quizItem.quizId);
    if (foundQuiz) {
      const title = foundQuiz.quizTitle;
      if (!acc[title]) {
        acc[title] = { ...quizItem, quizTitle: title };
      } else if (acc[title].quizPoints < quizItem.quizPoints) {
        acc[title] = { ...quizItem, quizTitle: title };
      }
    }
    return acc;
  }, {});

  // Convert the object back to an array for rendering
  const highestPointsQuizzes = Object.values(groupedQuizzes);

  return (
    <div>
      <Ournavbar />
      <h2 className="heading2">Name: {name}</h2>
      <h2 className="heading2">Email: {email}</h2>
      <div className="logout">
        {" "}
        <Button variant="danger" onClick={logoutfun}>
          Log out
        </Button>
      </div>

      <h3 className="heading">Overview of Your Quiz Scores:</h3>
      {highestPointsQuizzes.map((quizItem) => (
        <div key={quizItem._id}>
          <Card className="card_profile" style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{quizItem.quizTitle}</Card.Title>
              <Card.Text>Points: {quizItem.quizPoints}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default Profile;
