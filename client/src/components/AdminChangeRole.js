import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Navbar'
import api from "../api";

const AdminChangeRole = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/users`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${api}/users/${id}/role`,
        { role },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log(response.data);
      toast.success("User role changed successfully");
      getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to change user role");
    }
  };
  const handleDeleteUser = async(id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${api}/users/del/${id}`, {
            headers: {
                "x-auth-token": token,
                },
                });
                console.log(response.data);
                toast.success("User deleted successfully");
                getAllUsers();
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to delete user");
                    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleRoleChange = (id, role) => {
    setSelectedRole({ [id]: role });
  };

  const handleUpdateRole = (id) => {
    changeUserRole(id, selectedRole[id]);
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Update Role</th>
            <th>Delete User</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Form.Control
                  as="select"
                  value={selectedRole[user._id] || user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="instructor">instructor</option>
                  <option value="admin">admin</option>
                </Form.Control>
              </td>
              <td>
                <Button onClick={() => handleUpdateRole(user._id)}>Update</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer/>
    </div>
  );
};

export default AdminChangeRole;
