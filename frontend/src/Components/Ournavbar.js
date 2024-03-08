import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Ournavbar(props) {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">Quiz App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll>
              {props.typeOfUser_inserver === "" ? (
                <>
                  <NavDropdown title="Login" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/login">
                      Login as a Student
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/adminlogin">
                      Login as a Admin
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Register" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/register">
                      Register as a Student
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/adminregister">
                      Register as a Admin
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : null}
              <Nav.Link href="#action1">
                {props.typeOfUser_inserver === "admin" ? (
                  <Button className="button upload_button" href="/uploadquiz">
                    Upload Quiz
                  </Button>
                ) : null}
              </Nav.Link>
              <Nav.Link href="#action2">
                {props.typeOfUser_inserver !== "" &&
                props.inprofile !== "yes" ? (
                  <>
                    <Nav.Item className="profilepic">
                      <Nav.Link href="/profile">
                        <FontAwesomeIcon icon={faUser} />
                      </Nav.Link>
                    </Nav.Item>
                  </>
                ) : null}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Ournavbar;
