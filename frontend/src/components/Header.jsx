import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

function Header({ account, onLogout }) {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Evidence Management</Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Item>
              <Link className="nav-link" to="/add-evidence">Add Evidence</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to="/fetch-evidence">Fetch Evidence</Link>
            </Nav.Item>
            {account && (
              <Button variant="outline-secondary" onClick={onLogout} className="ms-3">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
