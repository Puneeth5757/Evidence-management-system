import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FetchEvidence = ({ contract }) => {
  const [evidenceId, setEvidenceId] = useState("");
  const [evidenceDetails, setEvidenceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const getEvidence = async () => {
    if (!evidenceId) {
      setErrorMessage("Please provide a valid evidence ID.");
      return;
    }

    if (contract) {
      setLoading(true);
      setErrorMessage("");

      try {
        const result = await contract.methods.getEvidence(evidenceId).call();

        if (result[0] === "") {
          setErrorMessage("No evidence found with the given ID.");
          setEvidenceDetails(null);
        } else {
          const timestamp = result[7];
          const timestampFormatted = new Date(Number(timestamp) * 1000).toLocaleString();

          setEvidenceDetails({
            evidenceId: result[0],
            caseName: result[1],
            victimName: result[2],
            location: result[3],
            description: result[4],
            evidenceHash: result[5],
            pdfHash: result[6],
            timestamp: timestampFormatted,
            addedBy: result[8], // Assuming this index is correct based on contract structure
          });
        }
      } catch (error) {
        console.error("Error fetching evidence:", error);
        setErrorMessage("Failed to fetch evidence. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Contract is not available.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Fetch Evidence</Card.Title>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>ID</InputGroup.Text>
            <FormControl
              placeholder="Enter Evidence ID"
              value={evidenceId}
              onChange={(e) => setEvidenceId(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <Button variant="primary" onClick={getEvidence} disabled={loading} className="me-2">
            {loading ? <Spinner animation="border" size="sm" /> : "Fetch Evidence"}
          </Button>

          <Button variant="secondary" onClick={() => navigate("/all-evidence")}>
            View All Evidence
          </Button>
        </Form>

        {evidenceDetails && (
          <div className="mt-3">
            <h5>Evidence Details:</h5>
            <ul>
              <li><strong>ID:</strong> {evidenceDetails.evidenceId}</li>
              <li><strong>Case Name:</strong> {evidenceDetails.caseName}</li>
              <li><strong>Victim Name:</strong> {evidenceDetails.victimName}</li>
              <li><strong>Location:</strong> {evidenceDetails.location}</li>
              <li><strong>Description:</strong> {evidenceDetails.description}</li>
              <li><strong>Hash:</strong> {evidenceDetails.evidenceHash}</li>
              <li><strong>Added On:</strong> {evidenceDetails.timestamp}</li>
              <li><strong>Added By:</strong> {evidenceDetails.addedBy}</li>
            </ul>

            <h5>Evidence Image:</h5>
            {evidenceDetails.evidenceHash && (
              <img
                src={`https://ipfs.io/ipfs/${evidenceDetails.evidenceHash}`}
                alt="Evidence"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}

            {evidenceDetails.pdfHash && (
              <div className="mt-3">
                <Button
                  variant="info"
                  onClick={() => {
                    const pdfUrl = `https://ipfs.io/ipfs/${encodeURIComponent(evidenceDetails.pdfHash)}`;
                    window.open(pdfUrl, "_blank");
                  }}
                >
                  View PDF
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FetchEvidence;
