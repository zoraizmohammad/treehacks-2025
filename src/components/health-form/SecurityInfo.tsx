
import React from 'react';
import { Lock, Shield } from "lucide-react";

const SecurityInfo: React.FC = () => {
  return (
    <>
      <div className="glass-card p-6 flex flex-col items-center text-center">
        <Lock className="w-8 h-8 text-[#F97316] mb-4" />
        <h3 className="text-xl font-semibold mb-2 rainbow-text">End-to-End Encryption</h3>
        <p className="text-gray-400">
          All data is encrypted right in your browser using advanced homomorphic encryption, so no one—not even us—can see your individual responses.
        </p>
      </div>

      <div className="glass-card p-6 flex flex-col items-center text-center">
        <Shield className="w-8 h-8 text-[#0EA5E9] mb-4" />
        <h3 className="text-xl font-semibold mb-2 rainbow-text">Privacy Guaranteed</h3>
        <p className="text-gray-400">
          Only aggregate results are ever decrypted. Your personal information remains hidden and cannot be accessed by any unauthorized parties.
        </p>
      </div>
    </>
  );
};

export default SecurityInfo;
