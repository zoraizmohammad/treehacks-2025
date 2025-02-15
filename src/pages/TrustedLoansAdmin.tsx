
import React from 'react';
import { motion } from "framer-motion";
import { Users, FileText, Settings, Database, DollarSign, Activity } from "lucide-react";
import Header from "@/components/Header";

const TrustedLoansAdmin = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header isTrustedLoans />
      <div className="text-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-[#0FA0CE]">Loan Management Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor loan applications and analytics</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 text-[#0FA0CE] mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">Active Applications</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">342</div>
                <div className="text-sm text-green-600">+12% from last month</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 text-[#0FA0CE] mb-4">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Total Loan Volume</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">$2.4M</div>
                <div className="text-sm text-gray-600">This quarter</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 text-[#0FA0CE] mb-4">
                <Activity className="w-5 h-5" />
                <span className="font-medium">Approval Rate</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">76%</div>
                <div className="text-sm text-gray-600">Last 30 days</div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 text-[#0FA0CE] mb-6">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Quick Actions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 rounded-lg bg-white border border-[#0FA0CE] text-[#0FA0CE] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5" />
                Review Applications
              </button>
              
              <button className="p-4 