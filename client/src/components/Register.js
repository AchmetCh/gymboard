import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import api from "../api";
import img from "../assets/loginImg.jpg";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./admincreateuser.css";

const stripePromise = loadStripe(
  "pk_test_51Pnr6NCw1XBrroeMb7eHQvuxYgnmzY5jW73ULkXxeBrQabhqmnOnI10I98RrHbRxQV7c3EveU9ZvNDuj7IbBifSe00PXSciE7a"
);

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [subscriptionDuration, setSubscriptionDuration] = useState(1);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const ToastFailed = () => toast.error("Password and Confirmation do not match");
  const ToastAlreadyExist = () => toast.info("User already exists, try to login");

  const validatePostalCode = (postalCode) => {
    return postalCode && postalCode.length >= 5; // Example validation, adjust as needed
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      ToastFailed();
      return;
    }

    if (!validatePostalCode(postalCode)) {
      toast.error("Postal code is incomplete or invalid");
      return;
    }

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: username,
        email: email,
        address: {
          postal_code: postalCode,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const newUser = {
      username,
      email,
      password,
      phoneNumber,
      subscriptionDuration,
      paymentMethodId: paymentMethod.id,
    };

    try {
      const response = await axios.post(`${api}/register`, newUser);
      localStorage.setItem("token", response.data.token);
      toast.success("Register Successful");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.status === 400) {
        ToastAlreadyExist();
      } else {
        toast.error("An unexpected error occurred");
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
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPostalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSubscriptionDuration">
            <Form.Label>Subscription Duration</Form.Label>
            <Form.Control
              as="select"
              value={subscriptionDuration}
              onChange={(e) =>
                setSubscriptionDuration(parseInt(e.target.value))
              }
            >
              <option value={1}>1 Month - €30</option>
              <option value={2}>2 Months - €50</option>
              <option value={3}>3 Months - €70</option>
              <option value={6}>6 Months - €125</option>
              <option value={12}>12 Months - €240</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Credit Card</Form.Label>
            <CardElement />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

const RegisterWrapper = () => (
  <Elements stripe={stripePromise}>
    <Register />
  </Elements>
);

export default RegisterWrapper;