import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
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
    "inputs": [{ "name": "_id", "type": "string" }],
    "name": "getEvidence",
    "outputs": [
      { "name": "evidenceId", "type": "string" },
      { "name": "caseName", "type": "string" },
      { "name": "victimName", "type": "string" },
      { "name": "location", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "evidenceHash", "type": "string" },
      { "name": "timestamp", "type": "uint256" },
      { "name": "addedBy", "type": "address" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_evidenceId", "type": "string" },
      { "name": "_caseName", "type": "string" },
      { "name": "_victimName", "type": "string" },
      { "name": "_location", "type": "string" },
      { "name": "_description", "type": "string" },
      { "name": "_evidenceHash", "type": "string" }
    ],
    "name": "addEvidence",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


const contractAddress = "0xBE0744f5F0B74f5088cCA48F5e8fc4E1DF3676e1";

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
    <Router>
    <Container className="mt-5">
      <Header />
      <Routes>
        <Route
          path="/add-evidence"
          element={<AddEvidence contract={contract} account={account} />}
        />
        <Route
          path="/fetch-evidence"
          element={<FetchEvidence contract={contract} />}
        />
        <Route path="/" element={<Navigate to="/add-evidence" />} />
        {/* You can add more routes for other components here */}
      </Routes>

      <Footer />
    </Container>
  </Router>
  );
}

export default App;