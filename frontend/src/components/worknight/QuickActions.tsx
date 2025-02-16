
import { Users, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm mb-8"
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
        
        <button className="p-4 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5" />
          System Settings
        </button>
      </div>
    </motion.div>
  );
};

export default QuickActions;
