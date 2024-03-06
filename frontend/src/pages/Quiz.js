import React, { useState, useEffect } from "react";
import Axios from "axios";
import Footer from "../Components/Footer";
import Ournavbar from "../Components/Ournavbar";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../CSS/Quiz.css";

function Quiz(props) {
  const [quiz, setquiz] = useState();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const history = useNavigate();
  const [points, setpoints] = useState(0);
  const [userid, setuserid] = useState();
  const [quizid, setquizid] = useState();

  useEffect(() => {
    const fetchD = async () => {
      try {
        const response = await Axios.post("http://localhost:3001/quiz", {
          path: decodedPath,
        }).then((res) => {
          if (res.data === "NOTOK") {
            history("/");
            alert("Kindly log in to access the course content");
          } else {
            console.log("data", res.data.quiz[0]._id);
            setuserid(res.data.username[0]._id);
            setquiz(res.data.quiz);
            setquizid(res.data.quiz[0]._id);
          }
        });
      } catch (error) {
        console.error("Error sending login request:", error);
      }
    };
    fetchD();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted answers:", selectedAnswers);
    try {
      const response = await Axios.post("http://localhost:3001/usernewpoints", {
        userid: userid,
        quizid: quizid,
        points: points,
      }).then((res) => {
        if (res.data === "OK") {
          history("/profile");
        } else {
          alert("There was a problem in server side");
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("There was an error updating points!", error);
    }
  };

  const fun_clicked_opp1 = (e, index) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [index]: e.target.value,
    });
    if (e.target.value === quiz[0].quizQuestions[index].CorrectAnswer) {
      setpoints(points + 1);
    }
  };

  const url = window.location.href;
  const path = url.replace("http://localhost:3000/quiz/", "");
  const decodedPath = decodeURIComponent(path.replace(/%20/g, " "));

  if (!Array.isArray(quiz)) {
    return <div>No Quizzes available</div>;
  }

  return (
    <div>
      <Ournavbar />
      <h5 className="points">Points in this Quiz: {points}</h5>
      {quiz.map((q) => (
        <div key={q._id}>
          <h2>{q.quizTitle}</h2>
          <p className="createdby">
            This Quiz is created by: {q.quizCreatedBy}
          </p>
          <div>
            {q.quizQuestions.map((quisQ, index) => (
              <div key={index}>
                <h5 className="question">
                  {index + 1}. {quisQ.Question}
                </h5>
                <Form className="Form">
                  {["radio"].map((type) => (
                    <div key={`inline-${type}`} className="mb-3">
                      <Form.Check
                        className="option1"
                        inline
                        label={
                          <span className="label-style">
                            {quisQ.Options.one}
                          </span>
                        }
                        name="group1"
                        type={type}
                        id={`inline-${type}-1`}
                        value={quisQ.Options.one}
                        onChange={(e) => fun_clicked_opp1(e, index)}
                        disabled={selectedAnswers.hasOwnProperty(index)}
                      />
                      <Form.Check
                        className="option2"
                        inline
                        label={quisQ.Options.two}
                        name="group1"
                        type={type}
                        value={quisQ.Options.two}
                        id={`inline-${type}-2`}
                        onChange={(e) => fun_clicked_opp1(e, index)}
                        disabled={selectedAnswers.hasOwnProperty(index)}
                      />
                      <Form.Check
                        className="option3"
                        inline
                        label={quisQ.Options.three}
                        name="group1"
                        type={type}
                        value={quisQ.Options.three}
                        id={`inline-${type}-2`}
                        onChange={(e) => fun_clicked_opp1(e, index)}
                        disabled={selectedAnswers.hasOwnProperty(index)}
                      />
                      <Form.Check
                        className="option4"
                        inline
                        label={quisQ.Options.four}
                        name="group1"
                        type={type}
                        value={quisQ.Options.four}
                        id={`inline-${type}-2`}
                        onChange={(e) => fun_clicked_opp1(e, index)}
                        disabled={selectedAnswers.hasOwnProperty(index)}
                      />
                    </div>
                  ))}
                </Form>
              </div>
            ))}
            <div className="center">
              {" "}
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
}

export default Quiz;
