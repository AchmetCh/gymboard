import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const NavigationBar = () => {
    const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.user.role);
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully", {
        onClose: () => navigate("/"),
      })
  };
  return (
    <Navbar bg="dark" className="d-flex" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        {" "}
        <h1 className="navbarH1">GymBoard</h1>{" "}
      </Navbar.Brand>
      <Navbar.Toggle arial-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Button className="m-3" variant="warning" onClick={() => handleLogout()}>
        Power Down
      </Button>{" "}
      <ToastContainer/>
    </Navbar>
  );
};
export default NavigationBar;
