import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiCancel } from "@react-icons/all-files/gi/GiCancel";
import "./userbookings.css";
import api from "../api";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/my-bookings`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setBookings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);
  const cancelBooking = async (e) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${api}/classes/cancel/${e}`, {
            headers: {
                "x-auth-token": token,
                },
                });
                toast.info("Class cancelled! See you next time! 😪 ");
                getBookings();
                } catch (error) {
                    console.error(error);
                    }
  } 
  return (
    <div>
      <h2 className="text-center fw-bold">My Bookings</h2>
      <Table striped bordered hover size="sm">
        <thead className="text-center">
          <tr>
            <th>Class</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.title}</td>
              <td>{booking.time}</td>
              <td>{booking.date}</td>
              <td className="text-center">
                <Button variant="danger" style={{ width: "100px" }} onClick={() => cancelBooking(booking._id)}>
                  Cancel <GiCancel />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer/>
    </div>
  );
};

export default UserBookings;
