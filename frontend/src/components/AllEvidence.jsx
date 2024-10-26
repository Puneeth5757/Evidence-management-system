import React, { useEffect, useState } from "react";
import { Card, ListGroup, Spinner, Alert } from "react-bootstrap";

const AllEvidence = ({ contract }) => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAllEvidence = async () => {
    if (!contract) {
      setErrorMessage("Contract is not available.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const ids = await contract.methods.getAllEvidence().call();

      const evidenceDetails = await Promise.all(
        ids.map(async (id) => {
          const result = await contract.methods.getEvidence(id).call();

          return {
            evidenceId: result[0],
            caseName: result[1],
            victimName: result[2],
            location: result[3],
            description: result[4],
            evidenceHash: result[5],
            timestamp: new Date(Number(result[6]) * 1000).toLocaleString(),
            addedBy: result[7],
          };
        })
      );

      setEvidenceList(evidenceDetails);
    } catch (error) {
      console.error("Error fetching evidence details:", error);
      setErrorMessage("Failed to fetch evidence details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvidence();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center"><b>All Evidence</b></Card.Title>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <ListGroup>
            {evidenceList.map((evidence) => (
              <ListGroup.Item key={evidence.evidenceId}>
                <h5>ID: {evidence.evidenceId}</h5>
                <p><strong>Case Name:</strong> {evidence.caseName}</p>
                <p><strong>Victim Name:</strong> {evidence.victimName}</p>
                <p><strong>Location:</strong> {evidence.location}</p>
                <p><strong>Description:</strong> {evidence.description}</p>
                <p><strong>Hash:</strong> {evidence.evidenceHash}</p>
                <p><strong>Added On:</strong> {evidence.timestamp}</p>
                <p><strong>Added By:</strong> {evidence.addedBy}</p>
                
                {/* Display the image from IPFS */}
                {evidence.evidenceHash && (
                  <img
                    src={`https://ipfs.infura.io/ipfs/${evidence.evidenceHash}`}
                    alt="Evidence"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default AllEvidence;
