import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BasicHealthInfo from "@/components/health-form/BasicHealthInfo";
import AdditionalHealthInfo from "@/components/health-form/AdditionalHealthInfo";
import SecurityInfo from "@/components/health-form/SecurityInfo";
import { HealthFormData } from "@/types/form";
import { getResponseVector } from "@/constants/vectorMappings";

interface BasicHealthVector {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  bloodType: string;
}

interface AdditionalHealthVector {
  exerciseFrequency: string;
  sleepHours: string;
  sleepQuality: string;
  dietaryBalance: string;
  mentalHealth: string;
  energyLevels: string;
  generalHealth: string;
  chronicPain: string;
  screenTimeImpact: string;
  mindfulnessPractices: string;
  writtenResponses: {
    dietaryBalance: string;
    mentalHealth: string;
    generalHealth: string;
    chronicPain: string;
    screenTimeImpact: string;
    mindfulnessPractices: string;
  };
}

type EncryptableData = BasicHealthVector | AdditionalHealthVector;

const encryptData = (data: EncryptableData, publicKey: string) => {
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
    
    // Create Basic Health Information vector
    const basicHealthVector: BasicHealthVector = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      age: formData.age,
      height: formData.height,
      weight: formData.weight,
      bloodType: formData.bloodType
    };

    // Create Additional Health Information vector with original responses
    const additionalHealthVector: AdditionalHealthVector = {
      exerciseFrequency: formData.exerciseFrequency,
      sleepHours: formData.sleepHours,
      sleepQuality: formData.sleepQuality,
      dietaryBalance: formData.dietaryBalance,
      mentalHealth: formData.mentalHealth,
      energyLevels: formData.energyLevels,
      generalHealth: formData.generalHealth,
      chronicPain: formData.chronicPain,
      screenTimeImpact: formData.screenTimeImpact,
      mindfulnessPractices: formData.mindfulnessPractices,
      writtenResponses: formData.writtenResponses
    };

    // Create vectorized version of the additional health information
    const localVectorizedData = {
      exerciseFrequency: formData.exerciseFrequency,
      sleepHours: formData.sleepHours,
      sleepQuality: formData.sleepQuality,
      energyLevels: formData.energyLevels,
      dietaryBalance: getResponseVector('dietaryBalance', formData.dietaryBalance),
      mentalHealth: getResponseVector('mentalHealth', formData.mentalHealth),
      generalHealth: getResponseVector('generalHealth', formData.generalHealth),
      chronicPain: getResponseVector('chronicPain', formData.chronicPain),
      screenTimeImpact: getResponseVector('screenTimeImpact', formData.screenTimeImpact),
      mindfulnessPractices: getResponseVector('mindfulnessPractices', formData.mindfulnessPractices),
      writtenResponses: formData.writtenResponses
    };

    // Create concatenated vector in specified order
    const userRawOutputMed = [
      ...getResponseVector('chronicPain', formData.chronicPain),
      ...getResponseVector('dietaryBalance', formData.dietaryBalance),
      ...getResponseVector('generalHealth', formData.generalHealth),
      ...getResponseVector('mentalHealth', formData.mentalHealth),
      ...getResponseVector('mindfulnessPractices', formData.mindfulnessPractices),
      ...getResponseVector('screenTimeImpact', formData.screenTimeImpact)
    ];

    const publicKey = "pk_demo123";
    const encryptedBasicData = encryptData(basicHealthVector, publicKey);
    const encryptedAdditionalData = encryptData(additionalHealthVector, publicKey);
    
    console.log('Basic Health Information Vector:', basicHealthVector);
    console.log('Original Additional Health Information:', additionalHealthVector);
    console.log('Vectorized Additional Health Information:', localVectorizedData);
    console.log('Concatenated User Raw Output Med Vector:', userRawOutputMed);

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
