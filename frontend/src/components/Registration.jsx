import React, { useState } from "react";
import { Button, Form, Spinner, Alert, Container, Row, Col, Card } from "react-bootstrap";
import { sha3 } from "web3-utils"; // to hash the password before sending

const Register = ({ contract, account }) => {
  const [department, setDepartment] = useState(""); // Moved department state to the top
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error handling

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on form submission

    if (!contract || !account) {
      setError("Contract or account is not initialized.");
      setLoading(false);
      return;
    }

    try {
      // Hash the password for storage in the smart contract
      const passwordHash = sha3(password);

      await contract.methods
        .registerUser(email, department, username, passwordHash, phoneNumber, address)
        .send({ from: account });

      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Registration failed. Please try again.");
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
              <Card.Title className="text-center mb-4">Register an Account</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={registerUser}>
                {/* Department First */}
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Username */}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Email */}
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

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Phone Number */}
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Address */}
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="text-primary">
                    Login here
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

export default Register;
