import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ViewClasses from "./components/ViewClasses";
import InsNewClass from "./components/InsNewClass";
import UserBookings from "./components/UserBookings";
import InsDeleteClass from "./components/InsDeleteClass";
import InsBookings from "./components/InsBookings";
import AdminChangeRole from "./components/AdminChangeRole";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");

  let role = null;
  try {
    const decodedToken = jwtDecode(token);
    role = decodedToken.user.role;
  } catch (error) {
    console.error(error);
  }
  return (
    <Router>
      <Navbar/>
  
      {role === "user" ? (
        <>
          <Routes>
            <Route path="/" element={<ViewClasses />} />
            <Route path="/mybookings" element={<UserBookings />} />
            {/* <Route path="/" element={<Home />} /> */}
          </Routes>
        </>
      ) : role === "instructor" ? (
        <>
          <Routes>
          <Route path="/" element={<ViewClasses />} />
          <Route path="/newclass" element={<InsNewClass />} />
          <Route path="/deleteclass" element={<InsDeleteClass />} />
          <Route path="/insbookings" element={<InsBookings />} />
            {/* <Route path="/" element={<Home />} /> */}
          </Routes>
        </>
      ) :role === "admin" ? (
        <>
          <Routes>
          <Route path="/" element={<ViewClasses />} />
          <Route path="/deleteclass" element={<InsDeleteClass />} />
          <Route path="/insbookings" element={<InsBookings />} />
          <Route path="/changeadminrole" element={<AdminChangeRole />} />
            {/* <Route path="/" element={<Home />} /> */}
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
