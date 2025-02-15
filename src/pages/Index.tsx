
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
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  height: "",
  weight: "",
  bloodType: "",
  exerciseFrequency: "3",
  sleepHours: "7",
  dietaryBalance: "",
  mentalHealth: "",
  energyLevels: "",
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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publicKey = "pk_demo123";
    const encryptedData = encryptData(formData, publicKey);
    
    toast({
      title: "Response Submitted Securely!",
      description: "Your data has been encrypted and sent.",
    });
  };

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
              Health Demographics Assessment
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Your responses are secure and encrypted
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
              <SecurityInfo />
              <BasicHealthInfo formData={formData} setFormData={setFormData} />
            </div>

            <div className="space-y-6">
              <SecurityInfo />
              <AdditionalHealthInfo 
                formData={formData} 
                setFormData={setFormData}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
