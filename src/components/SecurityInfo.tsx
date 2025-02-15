
import React from 'react';
import { Lock, Shield } from "lucide-react";

const SecurityInfo: React.FC = () => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#0FA0CE]/20 flex flex-col items-center text-center">
        <Lock className="w-8 h-8 text-[#0FA0CE] mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-[#0FA0CE]">End-to-End Encryption</h3>
        <p className="text-gray-600">
          All data is encrypted right in your browser using advanced homomorphic encryption, so no one—not even us—can see your individual responses.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-[#0FA0CE]/20 flex flex-col items-center text-center">
        <Shield className="w-8 h-8 text-[#0FA0CE] mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-[#0FA0CE]">Privacy Guaranteed</h3>
        <p className="text-gray-600">
          Only aggregate results are ever decrypted. Your personal information remains hidden and cannot be accessed by any unauthorized parties.
        </p>
      </div>
    </>
  );
};

export default SecurityInfo;
