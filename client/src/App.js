import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext'
import Navbar from './components/Navbar'
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        {/* Add your routes here */}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
