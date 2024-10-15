import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl, Card, Spinner, Alert } from "react-bootstrap";

const AddEvidence = ({ contract, account }) => {
  const [evidenceHash, setEvidenceHash] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // To show a loading spinner while adding evidence
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  const addEvidence = () => {
    if (!evidenceHash || !description) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    if (contract && account) {
      setLoading(true);
      setErrorMessage(""); // Clear any previous error messages

      contract.methods
        .addEvidence(evidenceHash, description)
        .send({ from: account })
        .then(() => {
          alert("Evidence added successfully!");
          setEvidenceHash("");
          setDescription("");
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Failed to add evidence. Please try again.");
        })
        .finally(() => {
          setLoading(false); // Hide loading spinner after the process is complete
        });
    } else {
      setErrorMessage("Contract or account is not available.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Add New Evidence</Card.Title>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Hash</InputGroup.Text>
            <FormControl
              placeholder="Evidence Hash"
              value={evidenceHash}
              onChange={(e) => setEvidenceHash(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Description</InputGroup.Text>
            <FormControl
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <Button variant="primary" onClick={addEvidence} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Add Evidence"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddEvidence;
