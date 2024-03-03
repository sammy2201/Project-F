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
        <Container className="cont">
          <Navbar.Brand href="/">E-learning</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {props.typeOfUser_inserver === "" ? (
                <>
                  <NavDropdown title="Login" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/login">
                      Login as a Student
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/adminlogin">
                      Login as a Teacher
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Register" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/register">
                      Register as a Student
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/adminregister">
                      Register as a Teacher
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : null}

              {props.typeOfUser_inserver === "admin" ? (
                <Button className="button ml-auto" href="/uploadquiz">
                  Upload Quiz
                </Button>
              ) : null}
              {props.typeOfUser_inserver !== "" && props.inprofile !== "yes" ? (
                <>
                  <Nav.Item className="profilepic">
                    <Nav.Link href="/profile">
                      <FontAwesomeIcon icon={faUser} />
                    </Nav.Link>
                  </Nav.Item>
                </>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Ournavbar;
