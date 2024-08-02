import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from './components/Login'
import Register from './components/Register'
import ViewClasses from './components/ViewClasses'
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      {/* Add your routes here */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view-classes" element={<ViewClasses />} />
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
