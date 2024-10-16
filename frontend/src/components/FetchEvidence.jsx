import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl, Card, Spinner, Alert } from "react-bootstrap";

const FetchEvidence = ({ contract }) => {
  const [evidenceId, setEvidenceId] = useState("");
  const [evidenceDetails, setEvidenceDetails] = useState(null);
  const [loading, setLoading] = useState(false); // To show a loading spinner while fetching evidence
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  const getEvidence = () => {
    if (!evidenceId) {
      setErrorMessage("Please provide a valid evidence ID.");
      return;
    }

    if (contract) {
      setLoading(true);
      setErrorMessage(""); // Clear any previous error messages

      contract.methods
        .getEvidence(parseInt(evidenceId))  // Convert evidenceId to an integer
        .call()
        .then((result) => {
          // Handle BigInt conversion here
          const timestamp = result[2];  // This is likely to be a BigInt

          // Convert BigInt to a number
          const timestampFormatted = new Date(Number(timestamp) * 1000).toLocaleString(); // Convert BigInt to Date object

          if (!result[0] || !result[1] || timestamp === "0" || result[3] === "0x0000000000000000000000000000000000000000") {
            setErrorMessage("No evidence found with the given ID.");
            setEvidenceDetails(null); // Reset evidence details if nothing is found
          } else {
            setEvidenceDetails({
              evidenceHash: result[0],
              description: result[1],
              timestamp: timestampFormatted,  // Use the formatted timestamp
              addedBy: result[3],
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Failed to fetch evidence. Please try again.");
        })
        .finally(() => {
          setLoading(false); // Hide loading spinner after the process is complete
        });
    } else {
      setErrorMessage("Contract is not available.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Retrieve Evidence</Card.Title>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Evidence ID</InputGroup.Text>
            <FormControl
              placeholder="Evidence ID"
              value={evidenceId}
              onChange={(e) => setEvidenceId(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <Button variant="secondary" onClick={getEvidence} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Get Evidence"}
          </Button>
        </Form>

        {evidenceDetails && (
          <div className="mt-4">
            <p><strong>Evidence Hash:</strong> {evidenceDetails.evidenceHash}</p>
            <p><strong>Description:</strong> {evidenceDetails.description}</p>
            <p><strong>Timestamp:</strong> {evidenceDetails.timestamp}</p>
            <p><strong>Added By:</strong> {evidenceDetails.addedBy}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FetchEvidence;
