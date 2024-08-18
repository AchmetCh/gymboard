import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import useUserStore from "./useStore";
import Button from "react-bootstrap/Button";
import { CgProfile } from "@react-icons/all-files/cg/CgProfile";
import { BiReset } from "@react-icons/all-files/bi/BiReset";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { IoMdLogOut } from "@react-icons/all-files/io/IoMdLogOut";
import api from "../api";

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { users, getAllUsers, currentUser, loading } = useUserStore();
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);




  let role = null;
  let name = null;
  try {
    const decodedToken = jwtDecode(token);
    role = decodedToken.user.role;
    name = decodedToken.user.name;
  } catch (error) {
    console.error(error);
  }

 

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Power down complete. Stay strong!", {
      onClose: () => navigate("/"),
    });
    setTimeout(() => (window.location.href = `/`), 2000);
  };
  const handleReset = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${api}/instructor/reset-available-spots`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      toast.success("Reset successful!", {
        onClose: () => navigate("/"),
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
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
              <Nav.Link
                as={Link}
                to="/"
                className="text-white text-decoration-none mx-2"
              >
                Classes
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/mybookings"
                className="text-white text-decoration-none mx-2"
              >
                My Bookings
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Text className="d-flex flex-column align-items-center me-5">
            {" "}
            <span>Subcription Valid until:</span> <span>{loading ? (<p>wait</p>): (<p>{currentUser.subscriptionEndDate.slice(0,10)}</p>)}</span>{" "}
          </Navbar.Text>
          <Navbar.Text className="d-flex flex-column align-items-center me-5">
            {" "}
            <CgProfile className="text-white fs-1" /> <span>Welcome</span>{" "}
            <span>{name}</span>{" "}
          </Navbar.Text>
          <Button
            className="m-3"
            variant="warning"
            onClick={() => handleLogout()}
          >
            Power Down <IoMdLogOut />
          </Button>{" "}
        </>
      ) : role === "instructor" ? (
        <>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                as={Link}
                to="/"
                className="text-white text-decoration-none"
              >
                Classes
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/newclass"
                className="text-white text-decoration-none"
              >
                Add New Class
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/insbookings"
                className="text-white text-decoration-none"
              >
                User Bookings
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/deleteclass"
                className="text-white text-decoration-none"
              >
                Delete Class
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Button
            className="m-3"
            variant="danger"
            onClick={() => handleReset()}
          >
            Reset All Classes <BiReset />
          </Button>{" "}
          <Navbar.Text className="d-flex flex-column align-items-center me-5">
            {" "}
            <CgProfile className="text-white fs-1" /> <span>Welcome</span>{" "}
            <span>{name}</span>{" "}
          </Navbar.Text>
          <Button
            className="m-3"
            variant="warning"
            onClick={() => handleLogout()}
          >
            Enough for Today <IoMdLogOut />
          </Button>{" "}
        </>
      ) : role === "admin" ? (
        <>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                as={Link}
                to="/"
                className="text-white text-decoration-none"
              >
                Classes
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/changeadminrole"
                className="text-white text-decoration-none"
              >
                Users
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admincreateuser"
                className="text-white text-decoration-none"
              >
                Create User
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Text className="d-flex flex-column align-items-center me-5">
            {" "}
            <CgProfile className="text-white fs-1" /> <span>Welcome</span>{" "}
            <span>{name}</span>{" "}
          </Navbar.Text>
          <Button
            className="m-3"
            variant="warning"
            onClick={() => handleLogout()}
          >
            Let's go Home <IoMdLogOut />
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
