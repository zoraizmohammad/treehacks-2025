import React from 'react';
import { motion } from "framer-motion";
import { Users, FileText, Settings } from "lucide-react";
import { AggregationButton } from "@/components/AggregationButton";

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center gap-3 text-[#0066CC] mb-6">
        <Settings className="w-5 h-5" />
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
  );
};

export default QuickActions;
