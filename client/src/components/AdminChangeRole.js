import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from './useStore'
import api from "../api";

const AdminChangeRole = () => {
  const {users, getAllUsers, loading} = useUserStore()
  const [selectedRole, setSelectedRole] = useState({});


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
    console.log(users)
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
            <th>Subcription End</th>
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
              <td>{user.subscriptionEndDate ? (<p>{user.subscriptionEndDate.slice(0,10)}</p>): (<p>Not available</p>)}</td>
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
