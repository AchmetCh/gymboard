import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import api from "../api";
import img from '../assets/loginImg.jpg'


const Login = () => {
  const ToasSuccessful = () =>
    toast.success("Login successful!", {
      onClose: () => navigate("/"),
    });
  const ToastFailed = () => toast.error("Login Failed! Please try again.");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    try {
      const response = await axios.post(`${api}/login`, credentials);
      localStorage.setItem("token", response.data.token);
      ToasSuccessful();
      setTimeout(() => window.location.href = `/`,2000);
    } catch (error) {
      console.error("Error response:", error.response);
      ToastFailed();
    }
  };

  return (
    <div className="loginContainer">
      <div>
        <img src={img} alt="Login" />
      </div>
      <div>
        <h2>Login Page</h2>
        <Form onSubmit={handleSubmit} className="loginForm">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="outline-primary" type="submit">
          Time to Shine
          </Button>
        </Form>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Login;
