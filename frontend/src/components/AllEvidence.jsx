import React, { useEffect, useState } from "react";
import { Card, ListGroup, Spinner, Alert, Form, InputGroup, FormControl, Row, Col } from "react-bootstrap";

const AllEvidence = ({ contract }) => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [filteredEvidenceList, setFilteredEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchCaseName, setSearchCaseName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchVictimName, setSearchVictimName] = useState("");

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
      setFilteredEvidenceList(evidenceDetails);
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

  const handleSearch = () => {
    const filtered = evidenceList.filter(evidence => 
      evidence.caseName.toLowerCase().includes(searchCaseName.toLowerCase()) &&
      evidence.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
      evidence.timestamp.toLowerCase().includes(searchDate.toLowerCase()) &&
      evidence.victimName.toLowerCase().includes(searchVictimName.toLowerCase())
    );

    setFilteredEvidenceList(filtered);
  };

  useEffect(() => {
    handleSearch(); // Call search whenever any of the search terms change
  }, [searchCaseName, searchLocation, searchDate, searchVictimName]);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center"><b>All Evidence</b></Card.Title>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {/* Sticky search bar with grid layout */}
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
          <ListGroup>
            {filteredEvidenceList.map((evidence) => (
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
