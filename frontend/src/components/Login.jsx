import React, { useState } from "react";
import { Button, Form, Spinner, Alert, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import Web3 from "web3";
import { sha3 } from "web3-utils"; // To hash the password entered by the user

const Login = ({ contract, account }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // To display error messages
  const navigate = useNavigate(); // Initialize useNavigate

  const loginUser = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(""); // Reset error message

    try {
      // Hash the entered password
      const passwordHash = sha3(password); 

      // Fetch the user details using the email
      const user = await contract.methods.users(account).call();

      if (user.email === email && user.passwordHash === passwordHash) {
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to the dashboard (where users can add/fetch evidence)
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid="md" className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <Card.Title className="text-center mb-4">Login to Your Account</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={loginUser}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  <a href="/register" className="text-primary">
                    Don't have an account? Register here
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
