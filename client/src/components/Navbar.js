import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'


const NavigationBar = () => {
    return (
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Navbar.Brand as={Link} to='/'> GymBoard</Navbar.Brand>
            <Navbar.Toggle arial-controls='basic-navbar-nav'/>
        </Navbar>
    )
}
export default NavigationBar