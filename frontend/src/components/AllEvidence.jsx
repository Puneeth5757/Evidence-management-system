import React, { useState, useEffect } from "react";
import { Button, Card, Spinner, Alert, InputGroup, FormControl, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AllEvidence = ({ contract }) => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [filteredEvidenceList, setFilteredEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State variables for search filters
  const [searchCaseName, setSearchCaseName] = useState("");
  const [searchVictimName, setSearchVictimName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const navigate = useNavigate();

  // Fetch all evidence from the smart contract
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

          const timestamp = result[7];
          const timestampFormatted = timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : "Invalid Date";

          return {
            evidenceId: result[0],
            caseName: result[1],
            victimName: result[2],
            location: result[3],
            description: result[4],
            evidenceHash: result[5],
            pdfHash: result[6],
            timestamp: timestampFormatted,
            addedBy: result[8] || "Unknown",
          };
        })
      );

      setEvidenceList(evidenceDetails);
      setFilteredEvidenceList(evidenceDetails);
    } catch (error) {
      console.error("Error fetching evidence details:", error);
      setErrorMessage("Failed to fetch evidence details.");
    } finally {
      setLoading(false);
    }
  };

  // Filter the evidence list based on search criteria
  const filterEvidence = () => {
    const filtered = evidenceList.filter((evidence) => {
      const caseNameMatch = evidence.caseName.toLowerCase().includes(searchCaseName.toLowerCase());
      const victimNameMatch = evidence.victimName.toLowerCase().includes(searchVictimName.toLowerCase());
      const locationMatch = evidence.location.toLowerCase().includes(searchLocation.toLowerCase());
      const timestampMatch = evidence.timestamp.toLowerCase().includes(searchDate.toLowerCase());

      return caseNameMatch && victimNameMatch && locationMatch && timestampMatch;
    });

    setFilteredEvidenceList(filtered);
  };

  useEffect(() => {
    filterEvidence();
  }, [searchCaseName, searchVictimName, searchLocation, searchDate]);

  useEffect(() => {
    fetchAllEvidence();
  }, [contract]);

  return (
    <div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <h2>All Evidence</h2>

      <div className="sticky-top bg-light p-3">
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <FormControl
                placeholder="Search by case name"
                value={searchCaseName}
                onChange={(e) => setSearchCaseName(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6}>
            <InputGroup>
              <FormControl
                placeholder="Search by location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <FormControl
                placeholder="Search by date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6}>
            <InputGroup>
              <FormControl
                placeholder="Search by victim name"
                value={searchVictimName}
                onChange={(e) => setSearchVictimName(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div>
          {filteredEvidenceList.length === 0 ? (
            <p>No evidence available.</p>
          ) : (
            filteredEvidenceList.map((evidence, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Title>Evidence ID: {evidence.evidenceId}</Card.Title>
                  <ul>
                    <li><strong>Case Name:</strong> {evidence.caseName}</li>
                    <li><strong>Victim Name:</strong> {evidence.victimName}</li>
                    <li><strong>Location:</strong> {evidence.location}</li>
                    <li><strong>Description:</strong> {evidence.description}</li>
                    <li><strong>Evidence Hash:</strong> {evidence.evidenceHash}</li>
                    <li><strong>Added On:</strong> {evidence.timestamp}</li>
                    <li><strong>Added By:</strong> {evidence.addedBy}</li>
                  </ul>

                  <h5>Evidence Image:</h5>
                  {evidence.evidenceHash && (
                    <img
                      src={`https://ipfs.io/ipfs/${evidence.evidenceHash}`}
                      alt="Evidence"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}

                  {evidence.pdfHash && (
                    <div className="mt-3">
                      <Button
                        variant="info"
                        onClick={() => {
                          const pdfUrl = `https://ipfs.io/ipfs/${encodeURIComponent(evidence.pdfHash)}`;
                          window.open(pdfUrl, "_blank");
                        }}
                      >
                        View PDF
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      )}

      <Button variant="secondary" onClick={() => navigate("/add-evidence")}>
        Add New Evidence
      </Button>
    </div>
  );
};

export default AllEvidence;
