import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Users, FileText, Settings, Database } from "lucide-react";
import Header from "@/components/Header";
import { useLocation } from 'react-router-dom';
import WorkNightAdmin from './WorkNightAdmin';
import { ethers } from 'ethers';
import { AggregationButton } from "@/components/AggregationButton";

const AdminDashboard = () => {
  const location = useLocation();
  const isWorkNight = location.pathname.includes('worknight');
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const updateStatus = (message: string) => {
    console.log(message);
    setStatus(message);
  };

  const requestAggregation = async () => {
    try {
      setLoading(true);
      setStatus('');
      setResult(null);

      updateStatus("Connecting to MetaMask...");
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      updateStatus("Initializing contract...");
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Step 1: Initialize company data
      updateStatus("Initializing company data...");
      const initResponse = await fetch(`${COMPANY_API_URL}/init-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: COMPANY_ID, recordCount: RECORD_COUNT })
      });

      if (!initResponse.ok) {
        throw new Error('Failed to initialize company data');
      }
      const initData = await initResponse.json();
      console.log("Company data initialized:", initData);

      // Step 2: Verify record count
      updateStatus("Verifying record count...");
      const countResponse = await fetch(`${COMPANY_API_URL}/${COMPANY_ID}/count`);
      if (!countResponse.ok) {
        throw new Error('Failed to verify record count');
      }
      const countData = await countResponse.json();
      console.log("Record count verified:", countData);

      // Step 3: Submit request
      updateStatus("Submitting request to blockchain...");
      const tx = await contract.requestAggregation(
        "average",
        `${COMPANY_API_URL}/${COMPANY_ID}/data`,
        COMPANY_ID,
        countData.recordCount,
        {
          gasLimit: 1000000,
        }
      );

      updateStatus("Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      const event = receipt.events?.find(e => e.event === "ValidationRequired");

      if (event) {
        const newRequestId = event.args?.[0].toString();
        setRequestId(newRequestId);
        updateStatus(`Request created with ID: ${newRequestId}`);
        console.log("Request ID:", newRequestId);

        // Step 4: Wait for processing
        updateStatus("Waiting for request processing...");

        // Listen for the AggregationProcessed event
        contract.once("AggregationProcessed",
          async (processedRequestId, processedResult) => {
            if (processedRequestId.toString() === newRequestId) {
              console.log("Received result:", processedResult.toString());
              setResult(processedResult.toString());

              // Get final request details
              const [, , , isProcessed, , , , isValidated, finalResult] =
                await contract.getAggregationRequest(newRequestId);

              updateStatus(`Request processed! Result: ${finalResult.toString()}`);
              console.log("Final request state:", {
                isProcessed,
                isValidated,
                result: finalResult.toString()
              });
            }
          }
        );
      }
    } catch (error: any) {
      console.error('Error:', error);
      updateStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isWorkNight) {
    return <WorkNightAdmin />;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Header />
      <div className="text-white p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[#F97316]">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage and monitor health demographic data</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 text-[#F97316] mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">Total Responses</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">1,234</div>
                <div className="text-sm text-green-400">+12% from last month</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 text-[#0EA5E9] mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">Average Age</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">27.5</div>
                <div className="text-sm text-gray-400">Years old</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 text-[#0EA5E9] mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
                <span className="font-medium">Database Status</span>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-green-400">Healthy</div>
                <div className="text-sm text-gray-400">Last backup: 2h ago</div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 text-[#0EA5E9] mb-6">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-medium">Quick Actions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 rounded-lg bg-gradient-to-r from-[#F97316] to-[#0EA5E9] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <Users className="w-5 h-5" />
                Export User Data
              </button>

              <button className="p-4 rounded-lg bg-gradient-to-r from-[#F97316] to-[#0EA5E9] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <FileText className="w-5 h-5" />
                Generate Report
              </button>

              <AggregationButton variant="mindful" companyId="mindful1" />
            </div>

            {/* Status and Result Display */}
            {(status || requestId || result) && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-2">
                {status && (
                  <p className="text-blue-400">{status}</p>
                )}
                {requestId && (
                  <p className="text-sm text-gray-400">Request ID: {requestId}</p>
                )}
                {result && (
                  <p className="text-green-400">Final Result: {result}</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
