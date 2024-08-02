import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import api from "../api";

const ViewClasses = () => {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/classes`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  const bookClass = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${api}/classes/book/${id}`, {}, {
        headers: {
          "x-auth-token": token,
        },
      });
      toast.success("Class booked successfully");
      fetchClasses();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (<div>
    <h2 className="text-center fw-bold ">Gym Classes</h2>
    <div className="d-flex gap-4 m-5">
      {classes.map((cls, index) => (
        <Card border="secondary" key={index} style={{ width: "18rem" }}>
          <Card.Img variant="top" src={`http://localhost:8000/${cls.img}`} />
          <Card.Body>
            <Card.Title>Class: {cls.title}</Card.Title>
            <Card.Subtitle>Day: {cls.date}</Card.Subtitle>
            <Card.Text>Time: {cls.time}</Card.Text>
            <Card.Text
              className={
                cls.availableSpots > 0 ? "text-success fs-4 " : "text-danger"
              }
            >
              {" "}
              Available Spots: {cls.availableSpots}
            </Card.Text>
            <Button variant="outline-primary" size="lg" onClick={() => bookClass(cls._id)}>
              Book Now
            </Button>
          </Card.Body>
        </Card>
      ))}
      <ToastContainer/>
    </div>
    </div>
  );
};

export default ViewClasses;
