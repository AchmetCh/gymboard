import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { RiDeleteBinFill } from "@react-icons/all-files/ri/RiDeleteBinFill";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const InsDeleteClass = () => {
  const [classes, setClasses] = useState([]);

  const getClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/classes`, {
        headers: {
            'x-auth-token':token,
            }
      });
      console.log(response.data);
      
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const cleanUpFunc = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${api}/cleanup`, {
        headers: {
          'x-auth-token':token,
          }
          });
          console.log(response.data);
        }catch (error) {
          console.error(error)
          }
  }
  useEffect(() => { 
    getClasses();
    cleanUpFunc()
  }, []);
  const deleteClass = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${api}/classes/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      toast.success("Class delete successfully");
      getClasses();
      window.location.reload()
    } catch (error) {
      console.error(error);
      toast.error('Error deleting Class')
    }
  };
  return (
    <div>
      <h2 className="text-center fw-bold"> Instructor Bookings & Delete Class</h2>
        <Table className="m-5">
            <thead>
                <tr>
                    <th>Class</th>
                    <th>AvailableSpots</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {classes.map((classItem) => (
                    <tr key={classItem._id}>
                        <td>{classItem.title}</td>
                        <td>{classItem.availableSpots}</td>
                        <td>{classItem.date}</td>
                        <td>{classItem.time}</td>
                        <td className="text-left">
                <Button variant="danger" style={{ width: "100px" }} onClick={() => deleteClass(classItem._id)}>
                  Delete <RiDeleteBinFill />
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

export default InsDeleteClass;
