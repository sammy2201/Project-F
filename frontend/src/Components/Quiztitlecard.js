import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../CSS/Quiztitlecard.css";
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Quiztitlecard(props) {
  if (!Array.isArray(props.quizarray)) {
    return <div>No Quizzes available</div>;
  }
  var randomNumber = getRandomNumber(1, 8);
  return (
    <div>
      <div className="card-container">
        {props.quizarray.map((q) => (
          <Card key={q._id}>
            <Card.Body>
              <Card.Title>{q.quizTitle}</Card.Title>
              <Card.Text>This Quiz is created by: {q.quizCreatedBy}</Card.Text>
              <Button variant="outline-success" href={"/quiz/" + q.quizTitle}>
                Take Quiz
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Quiztitlecard;
