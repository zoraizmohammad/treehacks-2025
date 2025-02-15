
import React from 'react';
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Database, Settings } from "lucide-react";
import Header from "@/components/Header";

const AdminDashboard = () => {
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
            <h1 className="text-4xl font-bold rainbow-text">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome to the Mindful University admin panel</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 flex flex-col items-center text-center"
            >
              <LayoutDashboard className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-sm text-gray-400">View health assessment statistics</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 flex flex-col items-center text-center"
            >
              <Users className="w-8 h-8 text-[#0EA5E9] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Participants</h3>
              <p className="text-sm text-gray-400">Manage participant data</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 flex flex-col items-center text-center"
            >
              <Database className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reports</h3>
              <p className="text-sm text-gray-400">Generate health reports</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 flex flex-col items-center text-center"
            >
              <Settings className="w-8 h-8 text-[#0EA5E9] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-sm text-gray-400">Configure system settings</p>
            </motion.div>
          </div>

          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card mt-8 p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="text-sm font-medium">New Assessment Submitted</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">New</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="text-sm font-medium">Report Generated</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Report</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="text-sm font-medium">System Update</p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">System</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
