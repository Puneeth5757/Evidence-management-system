

import React from "react";
import Web3 from "web3";
import { Button } from "react-bootstrap";

const Login = ({ setAccount, setWeb3 }) => {
  const handleLogin = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  return (
    <div className="text-center">
      <h2>Welcome to the Evidence Management System</h2>
      <br />
      <Button variant="primary" onClick={handleLogin}>
        Login with MetaMask
      </Button>
    </div>
  );
};

export default Login;
