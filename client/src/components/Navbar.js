import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = null;
  try {
    const decodedToken = jwtDecode(token);
    role = decodedToken.user.role;
  } catch (error) {
    console.error(error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully", {
      onClose: () => navigate("/"),
    });
    setTimeout(() => (window.location.href = `/`), 2000);
  };

  return (
    <Navbar bg="dark" className="d-flex" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        {" "}
        <h1 className="navbarH1">GymBoard</h1>{" "}
      </Navbar.Brand>
      {role === "user" ? (
        <>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                <Link
                  as={Link}
                  to="/"
                  className="text-white text-decoration-none"
                >
                  Classes
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Button
            className="m-3"
            variant="warning"
            onClick={() => handleLogout()}
          >
            Power Down
          </Button>{" "}
        </>
      ) : (
        <>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"></Nav>
          </Navbar.Collapse>
        </>
      )}
      <ToastContainer />
    </Navbar>
  );
};
export default NavigationBar;
