
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";

interface ApplicationFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
  };
  experience: {
    currentTitle: string;
    yearsExperience: string;
    education: string;
    skills: string;
  };
  voluntaryDisclosure: {
    disability: string;
    veteranStatus: string;
    gender: string;
    ethnicity: string;
  };
}

const initialFormData: ApplicationFormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "English",
  },
  experience: {
    currentTitle: "",
    yearsExperience: "",
    education: "",
    skills: "",
  },
  voluntaryDisclosure: {
    disability: "",
    veteranStatus: "",
    gender: "",
    ethnicity: "",
  },
};

const WorkNight = () => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "Your application has been received.",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header isWorkNight />
      <div className="text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-6 text-white">
              Developer Technology Intern, AI - Summer 2025
            </h1>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Application Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>My Information</span>
              <span>My Experience</span>
              <span>Application Questions</span>
              <span>Voluntary Disclosures</span>
              <span>Self Identify</span>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6">Self Identify</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={formData.personalInfo.language}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, language: e.target.value }
                  })}
                  required
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Voluntary Self-Identification of Disability</h3>
                <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-400 mb-2">Form CC-305</p>
                  <p className="text-sm text-gray-400 mb-2">OMB Control Number: 1250-0005</p>
                  <p className="text-sm text-gray-400">Expires: 04/30/2026</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Employee ID (if applicable)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Optional"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkNight;
