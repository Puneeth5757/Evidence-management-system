import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Web3 from "web3";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddEvidence from "./components/AddEvidence";
import FetchEvidence from "./components/FetchEvidence";
import AllEvidence from "./components/AllEvidence";
import Login from "./components/Login";
import { approvedAddresses } from "./constants/approvedAddresses";
import { Container, Spinner, Alert } from "react-bootstrap";

const contractABI = [
  {
        "constant": false,
        "inputs": [
          { "name": "_evidenceId", "type": "string" },
          { "name": "_caseName", "type": "string" },
          { "name": "_victimName", "type": "string" },
          { "name": "_location", "type": "string" },
          { "name": "_description", "type": "string" },
          { "name": "_evidenceHash", "type": "string" },
          { "name": "_pdfHash", "type": "string" }
        ],
        "name": "addEvidence",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
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
          { "name": "pdfHash", "type": "string" },
          { "name": "timestamp", "type": "uint256" },
          { "name": "addedBy", "type": "address" }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getAllEvidence",
        "outputs": [{ "name": "", "type": "string[]" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
    ]
const contractAddress = "0x1ff628c1612ccAEad81Ec2F90a81B80d1D834F07";

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const evidenceContract = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(evidenceContract);
          setLoading(false);
        } catch (error) {
          console.error("Error setting up contract:", error);
          setLoading(false);
        }
      } else {
        alert("Please install MetaMask or another Ethereum provider.");
        setLoading(false);
      }
    };
    initContract();
  }, []);

  useEffect(() => {
    if (account) {
      setIsAuthorized(approvedAddresses.includes(account));
    }
  }, [account]);

  const handleLogout = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Router>
      <Container className="mt-5">
        <Header account={account} onLogout={handleLogout} />
        {account ? (
          <Routes>
            {isAuthorized ? (
              <Route path="/add-evidence" element={<AddEvidence contract={contract} account={account} />} />
            ) : (
              <Route
                path="/add-evidence"
                element={<Alert variant="danger">Access Denied: You are not authorized to add evidence.</Alert>}
              />
            )}
            <Route path="/fetch-evidence" element={<FetchEvidence contract={contract} />} />
            <Route path="/all-evidence" element={<AllEvidence contract={contract} />} />
            <Route path="/" element={<Navigate to="/add-evidence" />} />
          </Routes>
        ) : (
          <Login setAccount={setAccount} setWeb3={setWeb3} />
        )}
        <Footer />
      </Container>
    </Router>
  );
}

export default App;
