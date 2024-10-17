import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Register from "../src/components/Registration";
import Login from "../src/components/Login";

function AppRoutes({ contract, account }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        if (!contract) {
          console.error("Contract is not defined");
          return;
        }
        const isUserRegistered = await contract.methods.isUserRegistered().call({
          from: account,
        });
        setIsRegistered(isUserRegistered);
      } catch (error) {
        console.error("Failed to check registration", error);
      } finally {
        setLoading(false);
      }
    };

    if (account && contract) {
      checkRegistration();
    } else {
      setLoading(false); // Ensure loading is false if account/contract isn't available
    }
  }, [contract, account]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading component
  }

  return (
    <Router>
      <Routes>
        {/* If user is not registered, redirect to login or register */}
        <Route
          path="/"
          element={
            isRegistered ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Registration Route */}
        <Route
          path="/register"
          element={<Register contract={contract} account={account} />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={<Login contract={contract} account={account} />}
        />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<App />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
