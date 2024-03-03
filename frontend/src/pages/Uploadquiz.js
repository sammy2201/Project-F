import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Footer from "../Components/Footer";
import Ournavbar from "../Components/Ournavbar";
import "../CSS/uploadform.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Uploadquiz = () => {
  const history = useNavigate();
  const [title, settitle] = useState("");
  const [createdby, setcreatedby] = useState("");
  const [questions, setquestions] = useState([{ questions: "" }]);

  const Title_fun = (e) => settitle(e.target.value);
  const createdBy_fun = (e) => setcreatedby(e.target.value);

  const hangle_add_questions = (e) => {
    setquestions([...questions, { questions: "" }]);
  };

  const hangle_remove_questions = (index) => {
    console.log(index);
    const list = [...questions];
    list.splice(index, 1);
    setquestions(list);
  };

  const handle_question_change = (e, index) => {
    const { name, value } = e.target;
    const list = [...questions];
    list[index].questions = value;
    setquestions(list);
  };

  const upload = async (e) => {
    console.log(questions);
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("createdby", createdby);
    formdata.append("questions", questions);
    try {
      const response = await Axios.post(
        "http://localhost:3001/uploadquiz",
        formdata
      ).then((res) => {
        if (res.data === "OK") {
          history("/");
        } else if (res.data === "adminlogin") {
          history("/adminlogin");
        } else {
          alert("Kindly register as teacher to upload Quiz");
        }
      });
    } catch (error) {
      console.error("Error sending upload request:", error);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await Axios.get("http://localhost:3001/getimage");
  //       seti(response.data[0].img);
  //       setv(response.data[0].videoPath);
  //     } catch (error) {
  //       console.error("Error fetching image:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getuserinfo");
        console.log("user login info ", response.data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Ournavbar />
      <div className="uploadform">
        <h2>Upload your Quiz details</h2>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Title:
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={Title_fun}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Created by:
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={createdBy_fun}
          />
        </InputGroup>

        {questions.map((question, index) => (
          <div key={index}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Question:
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                // onChange={Title_fun}
                value={question.questions}
                onChange={(e) => handle_question_change(e, index)}
              />
            </InputGroup>
            {questions.length - 1 === index ? (
              <button onClick={hangle_add_questions}>Add</button>
            ) : null}
            {questions.length > 1 ? (
              <button onClick={() => hangle_remove_questions(index)}>
                Remove
              </button>
            ) : null}
          </div>
        ))}

        <input
          className="btn-sub"
          type="submit"
          value="Upload"
          onClick={upload}
        />
      </div>
      {/* <img className="image" src={`http://localhost:3001/uploads/` + i} />
      {v ? (
        <video width="320" height="240" controls loop autoPlay>
          <source src={`http://localhost:3001/uploads/` + v} type="video/mp4" />
        </video>
      ) : (
        <p>Loading video...</p>
      )} */}

      <Footer />
    </div>
  );
};

export default Uploadquiz;
