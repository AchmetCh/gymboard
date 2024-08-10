import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import './insbookings.css'

const InsBookings = () => {
  const [bookings, setBookings] = useState([]);
  const getInstructorBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/instructor-bookings`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setBookings(response.data);
      console.log(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    getInstructorBookings();
  }, []);
  return (
    <div>
      <h2 className="text-center fw-bold">User Bookings</h2>
      <div className="d-flex mycards">

      {bookings.map((item) => (
          <Card style={{ width: "300px", margin:'15px' }} key={item.gymClass._id} className="gap-4">
          <Card.Body key={item.gymClass._id}>
            <div className="d-flex gap-5">
              <Card.Title>{item.gymClass.title}</Card.Title>
              <Card.Text>{item.gymClass.date}</Card.Text>
              <Card.Text>{item.gymClass.time}</Card.Text>
            </div>
            <Table>
              <thead>
                <tr key={item.gymClass._id}>
                  <th>Student Name</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                 {item.users.map((user) => {
                  return  <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.phoneNumber}</td>
                    </tr>
                 })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default InsBookings;
