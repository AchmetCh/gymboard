import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css'
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div className="container">
      <header className="HomePageContainer">
        <div className="homeH1">
        <h3 >What seems impossible today</h3>
        <h4>will one day become your warm-up.</h4>
        </div>
     
      <main>
        <button className="homeButtons" onClick={handleLogin}>Login</button>
        <button className="homeButtons" onClick={handleRegister}>Register</button>
      </main>
      </header>
      <Footer/>
    </div>
  );
};

export default Home;
