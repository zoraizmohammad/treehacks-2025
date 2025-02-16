import React from 'react';
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CSVData {
  headers: string[];
  rows: string[][];
}

// Sample data - replace with actual data from C++ backend
const sampleData: CSVData = {
  headers: ["ID", "Age", "Gender", "Location", "Education", "Experience", "Skills"],
  rows: [
    ["1", "25", "Female", "San Francisco", "Bachelor's", "3 years", "Python, React"],
    ["2", "30", "Male", "New York", "Master's", "5 years", "C++, Java"],
    ["3", "28", "Non-binary", "Seattle", "PhD", "4 years", "ML, AI"],
    ["4", "22", "Female", "Boston", "Bachelor's", "1 year", "JavaScript, Node.js"],
    ["5", "35", "Male", "Austin", "Master's", "8 years", "Rust, Go"],
  ]
};

export const CSVViewer: React.FC = () => {
  const handleDownload = () => {
    // Convert data to CSV format
    const csvContent = [
      sampleData.headers.join(','),
      ...sampleData.rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'worknight_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#0066CC]">Raw Application Data</h3>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {sampleData.headers.map((header, index) => (
                  <TableHead key={index} className="bg-gray-50">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};

export default CSVViewer;
