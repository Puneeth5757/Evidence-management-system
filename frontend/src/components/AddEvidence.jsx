import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl, Card, Spinner, Alert } from "react-bootstrap";

const AddEvidence = ({ contract, account }) => {
  const [evidenceId, setEvidenceId] = useState("");
  const [caseName, setCaseName] = useState("");
  const [victimName, setVictimName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceHash, setEvidenceHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addEvidence = () => {
    if (!evidenceId || !caseName || !victimName || !location || !description || !evidenceHash) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (contract && account) {
      setLoading(true);
      setErrorMessage("");

      contract.methods
        .addEvidence(evidenceId, caseName, victimName, location, description, evidenceHash)
        .send({ from: account })
        .then(() => {
          alert("Evidence added successfully!");
          setEvidenceId("");
          setCaseName("");
          setVictimName("");
          setLocation("");
          setDescription("");
          setEvidenceHash("");
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Failed to add evidence. Please try again.");
        })
        .finally(() => {
          setLoading(false);
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
            <InputGroup.Text>ID</InputGroup.Text>
            <FormControl
              placeholder="Evidence ID"
              value={evidenceId}
              onChange={(e) => setEvidenceId(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Case Name</InputGroup.Text>
            <FormControl
              placeholder="Case Name"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Victim Name</InputGroup.Text>
            <FormControl
              placeholder="Victim Name"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Location</InputGroup.Text>
            <FormControl
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Description</InputGroup.Text>
            <FormControl
              placeholder="Detailed Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Hash</InputGroup.Text>
            <FormControl
              placeholder="Evidence Hash"
              value={evidenceHash}
              onChange={(e) => setEvidenceHash(e.target.value)}
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
