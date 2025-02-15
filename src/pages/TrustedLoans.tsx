
import { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const TrustedLoans = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Header isTrustedLoans />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#0FA0CE] mb-4">Personal Loan Application</h1>
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-gray-100" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Personal Info</span>
              <span>Employment & Loan</span>
              <span>Demographics</span>
            </div>
          </div>
        </motion.div>

        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <p className="text-gray-600 text-center">
            Ready to start your loan application? We'll guide you through each step.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 bg-[#0FA0CE] text-white rounded-md hover:bg-[#0E90BE] transition-colors"
            >
              Start Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedLoans;
