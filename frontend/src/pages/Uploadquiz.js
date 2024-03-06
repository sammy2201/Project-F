import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Footer from "../Components/Footer";
import Ournavbar from "../Components/Ournavbar";
import "../CSS/uploadform.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Uploadquiz = () => {
  const history = useNavigate();
  const [title, settitle] = useState("");
  const [createdby, setcreatedby] = useState("");
  const [questions, setquestions] = useState([
    { questions: "", o1: "", o2: "", o3: "", o4: "", co: "" },
  ]);
  const [user_info, setuser_info] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getuserinfo");
        console.log("user login info ", response.data);
        setuser_info(response.data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchData();
  }, []);

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
    const { value } = e.target;
    const list = [...questions];
    list[index].questions = value;
    setquestions(list);
  };

  const option1_fun = (e, index) => {
    const { value } = e.target;
    const list = [...questions];
    list[index].o1 = value;
    setquestions(list);
  };
  const option2_fun = (e, index) => {
    const { value } = e.target;
    const list = [...questions];
    list[index].o2 = value;
    setquestions(list);
  };
  const option3_fun = (e, index) => {
    const { value } = e.target;
    const list = [...questions];
    list[index].o3 = value;
    setquestions(list);
  };
  const option4_fun = (e, index) => {
    const { value } = e.target;
    const list = [...questions];
    list[index].o4 = value;
    setquestions(list);
  };
  const optionco_fun = (e, index) => {
    const { value } = e.target;
    const list = [...questions];
    list[index].co = value;
    setquestions(list);
  };

  const upload = async (e) => {
    console.log(questions);
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3001/uploadquiz", {
        title: title,
        createdby: createdby,
        questions: JSON.stringify(questions),
        user_info: user_info,
      }).then((res) => {
        if (res.data === "OK") {
          history("/");
        } else if (res.data === "adminlogin") {
          history("/adminlogin");
        } else {
          alert("Kindly register as admin to upload Quiz");
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
                value={question.questions}
                onChange={(e) => handle_question_change(e, index)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Control
                aria-label="option 1"
                placeholder="Option 1"
                value={question.o1}
                onChange={(e) => option1_fun(e, index)}
              />
              <Form.Control
                aria-label="option 2"
                placeholder="Option 2"
                value={question.o2}
                onChange={(e) => option2_fun(e, index)}
              />
              <Form.Control
                aria-label="option 3"
                placeholder="Option 3"
                value={question.o3}
                onChange={(e) => option3_fun(e, index)}
              />
              <Form.Control
                aria-label="option 4"
                placeholder="Option 4"
                value={question.o4}
                onChange={(e) => option4_fun(e, index)}
              />
              <Form.Control
                aria-label="correct option"
                placeholder="Correct Option"
                value={question.co}
                onChange={(e) => optionco_fun(e, index)}
              />
            </InputGroup>
            <div className="center-text">
              {" "}
              {questions.length - 1 === index ? (
                <Button
                  className="primary addbutton"
                  onClick={hangle_add_questions}>
                  Add
                </Button>
              ) : null}
              {questions.length > 1 ? (
                <Button
                  className=" removebutton"
                  variant="danger"
                  onClick={() => hangle_remove_questions(index)}>
                  Remove Question {index + 1}
                </Button>
              ) : null}
            </div>
          </div>
        ))}

        <input
          className="btn-sub"
          type="submit"
          value="Upload"
          onClick={upload}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Uploadquiz;
