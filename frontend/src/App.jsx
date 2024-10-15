import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddEvidence from "./components/AddEvidence";
import FetchEvidence from "./components/FetchEvidence";
import { Container, Row, Col, Spinner } from "react-bootstrap";

// Contract ABI and address (replace with actual values)
const contractABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_id", "type": "uint256" }],
    "name": "getEvidence",
    "outputs": [
      { "name": "", "type": "string" },
      { "name": "", "type": "string" },
      { "name": "", "type": "uint256" },
      { "name": "", "type": "address" },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_evidenceHash", "type": "string" },
      { "name": "_description", "type": "string" },
    ],
    "name": "addEvidence",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
];
const contractAddress = "0xC6aB18aC2e58fbE8Bb6dC4f2b4A3B7707bdAe1a3"; // Replace with your contract address

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for Web3 and contract

  // Effect to initialize Web3, contract, and user account
  useEffect(() => {
    if (window.ethereum && window.ethereum.isConnected()) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const evidenceContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(evidenceContract);
        setLoading(false); // Set loading to false once contract is initialized
      }).catch((error) => {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask.");
        setLoading(false);
      });
    } else {
      alert("Please install MetaMask or another Ethereum provider.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Container className="mt-5">
      <Header />

      <Row className="mb-4">
        <Col>
          {/* Pass contract and account as props to AddEvidence component */}
          <AddEvidence contract={contract} account={account} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          {/* Pass contract as a prop to FetchEvidence component */}
          <FetchEvidence contract={contract} />
        </Col>
      </Row>

      <Footer />
    </Container>
  );
}

export default App;
