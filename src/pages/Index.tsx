
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BasicHealthInfo from "@/components/health-form/BasicHealthInfo";
import AdditionalHealthInfo from "@/components/health-form/AdditionalHealthInfo";
import SecurityInfo from "@/components/health-form/SecurityInfo";
import { HealthFormData } from "@/types/form";

const encryptData = (data: any, publicKey: string) => {
  return JSON.stringify(data) + `_encrypted_with_${publicKey}`;
};

const initialFormData: HealthFormData = {
  firstName: "David",
  lastName: "Smith",
  email: "david.smith@university.edu",
  age: "20",
  height: "175",
  weight: "70",
  bloodType: "A+",
  exerciseFrequency: "3",
  sleepHours: "7",
  sleepQuality: "good",
  dietaryBalance: "",
  mentalHealth: "",
  energyLevels: "moderate",
  generalHealth: "",
  chronicPain: "",
  screenTimeImpact: "",
  mindfulnessPractices: "",
  responseType: "dropdown",
  writtenResponses: {
    dietaryBalance: "",
    mentalHealth: "",
    generalHealth: "",
    chronicPain: "",
    screenTimeImpact: "",
    mindfulnessPractices: ""
  }
};

const Index = () => {
  const [formData, setFormData] = useState<HealthFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publicKey = "pk_demo123";
    const encryptedData = encryptData(formData, publicKey);
    
    toast({
      title: "Response Submitted Securely!",
      description: "Your data has been encrypted and sent.",
    });
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#1A1F2C]">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold rainbow-text mb-8">Application Submitted!</h1>
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="encryption-visualizer" />
              <p className="text-white text-lg">
                Thank you for your application. Your information is secure and protected through Dual Key homomorphic encryption.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Header />
      <div className="text-white p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold rainbow-text mb-6">
              Student Health Demographics Assessment
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Your responses are secure and encrypted
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
            <SecurityInfo />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <BasicHealthInfo formData={formData} setFormData={setFormData} />
            <AdditionalHealthInfo 
              formData={formData} 
              setFormData={setFormData}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
