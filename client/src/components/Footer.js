import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Footer = () => {
  return (
    <footer
      className="bg-dark text-white mt-2 myFooter"
    >
      <Container fluid >
        <Row>
          <Col md="4">
            <h5>About Us</h5>
            <p>
              We are Gymboard, a premier gym offering a wide range of fitness classes designed to help you achieve your health and wellness goals. Our expert trainers and state-of-the-art facilities are here to support you every step of the way.
            </p>
          </Col>
          <Col md="4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Home</a></li>
              <li><a href="#" className="text-white">Classes</a></li>
              <li><a href="#" className="text-white">Membership</a></li>
              <li><a href="#" className="text-white">Contact</a></li>
            </ul>
          </Col>
          <Col md="4">
            <h5>Contact Us</h5>
            <p>
              Email: info@gymboard.com<br />
              Phone: +123 456 7890<br />
              Address: 123 Fitness St, Workout City, USA
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3">
            <p>&copy; {new Date().getFullYear()} Gymboard. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
