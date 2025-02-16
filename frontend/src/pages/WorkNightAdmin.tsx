import React from 'react';
import { motion } from "framer-motion";
import { Users, FileText, Settings, Database } from "lucide-react";
import Header from "@/components/Header";
import { AggregationButton } from "@/components/AggregationButton";

const WorkNightAdmin = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header isWorkNight />
      <div className="text-black p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-[#0066CC]">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor application and candidate data</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#0066CC] mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">Total Applications</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-black">847</div>
                <div className="text-sm text-green-600">+8% from last week</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#0066CC] mb-4">
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
                <span className="font-medium">Average Response Time</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-black">3.2</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#0066CC] mb-4">
                <Database className="w-5 h-5" />
                <span className="font-medium">System Status</span>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-green-600">Operational</div>
                <div className="text-sm text-gray-600">Last check: 5m ago</div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 text-[#0066CC] mb-6">
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
              <button className="p-4 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5" />
                Export Applications
              </button>

              <button className="p-4 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5" />
                Generate Report
              </button>

              <AggregationButton variant="worknight" companyId="worknight1" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkNightAdmin;
