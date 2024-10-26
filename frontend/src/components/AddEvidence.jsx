import React, { useState } from "react";
import { Button, Form, InputGroup, FormControl, Card, Spinner, Alert } from "react-bootstrap";
import uploadToIPFS from '../utilities/ipfsUpload';

const AddEvidence = ({ contract, account }) => {
  const [evidenceId, setEvidenceId] = useState("");
  const [caseName, setCaseName] = useState("");
  const [victimName, setVictimName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);

  const addEvidence = async () => {
    if (!evidenceId || !caseName || !victimName || !location || !description || !image) {
      setErrorMessage("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Upload the image to IPFS using Pinata
      const result = await uploadToIPFS(image);
      const hash = result.IpfsHash; // Get the IPFS hash from the response

      // Now call the smart contract to add the evidence
      await contract.methods
        .addEvidence(evidenceId, caseName, victimName, location, description, hash)
        .send({ from: account });

      alert("Evidence added successfully!");
      // Reset the form fields
      setEvidenceId("");
      setCaseName("");
      setVictimName("");
      setLocation("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to add evidence. Please try again.");
    } finally {
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
            <InputGroup.Text>Image</InputGroup.Text>
            <FormControl
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
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
