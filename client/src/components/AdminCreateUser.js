import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import api from "../api";
import img from "../assets/loginImg.jpg";
import "./admincreateuser.css";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
 
  const ToastFailed = () => toast.error("Password and Confirmation not match");
  const ToastALreadyExist = () => toast.info("User already exist try to login");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      ToastFailed();
      return;
    }
    const newUser = { username, email, password, phoneNumber };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${api}/createuser`, newUser, {
        headers: {
          'x-auth-token': token
      }});
      toast.success('Register Successful')
      setTimeout(() => {
        navigate('/changeadminrole')
        window.location.reload()
      }, 2000);
    } catch (error) {
      if (error.response.status === 400) {
        ToastALreadyExist();
      }
    }
  };
  return (
    <div className="registerContainer">
      <div>
        <img src={img} alt="Login" />
      </div>
      <div>
        <h2>Create an Account</h2>
        <Form onSubmit={handleRegister} className="loginForm">
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Group>
          <Button variant="outline-primary" type="submit">
            Create user
          </Button>
        </Form>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default CreateUser;
