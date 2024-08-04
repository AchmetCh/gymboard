import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./insnewclass.css";
import api from "../api";

const InsNewClass = () => {
  const ToasSuccessful = () =>
    toast.success("Class Created successfully!", {
      onClose: () => navigate("/"),
    });
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableSpots, setAvailableSpots] = useState("");
  const [img, setImg] = useState(null);

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("availableSpots", availableSpots);
    if (img) formData.append("img", img);

    try {
      const response = await axios.post(
        `${api}/classes`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log("Class created successfully:", response.data);
      ToasSuccessful();
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Error creating class:", error.message);
    }
  };

  return (
    <div>
      <Container>
        <h2 className="my-4">Create a New Class</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formTitle">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formDate">
            <Form.Label column sm={2}>
              Date
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                as="select"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formTime">
            <Form.Label column sm={2}>
              Time
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formAvailableSpots">
            <Form.Label column sm={2}>
              Available Spots
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                value={availableSpots}
                onChange={(e) => setAvailableSpots(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formImg">
            <Form.Label column sm={2}>
              Image
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="file" onChange={handleFileChange} />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Create Class
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default InsNewClass;
