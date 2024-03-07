import React, { useEffect, useState } from "react";
import Axios from "axios";
import Ournavbar from "../Components/Ournavbar";

function Profile() {
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
      <h2>{name}</h2>
      <h2>{email}</h2>
      {highestPointsQuizzes.map((quizItem) => (
        <div key={quizItem._id}>
          <p>Quiz title: {quizItem.quizTitle}</p>
          <p>Quiz Points: {quizItem.quizPoints}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;
