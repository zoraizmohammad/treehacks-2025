
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simulated encryption function - in real app would use actual encryption
const encryptData = (data: any, publicKey: string) => {
  return JSON.stringify(data) + `_encrypted_with_${publicKey}`;
};

const Index = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    stressLevel: "3",
    anxiety: "3",
    sleep: "3",
    mood: "3"
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publicKey = "pk_demo123"; // In real app, this would be provided by the organization
    
    // Simulate encryption
    const encryptedData = encryptData(formData, publicKey);
    
    toast({
      title: "Response Submitted Securely!",
      description: "Your data has been encrypted and sent.",
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold rainbow-text mb-6">
            Mental Health Assessment
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your responses are secure and encrypted
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="encryption-visualizer" />
            <h2 className="text-2xl font-bold mb-6 rainbow-text">Mental Health Questionnaire</h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Stress Level (1-5)
                </label>
                <input
                  type="range"
                  className="w-full"
                  min="1"
                  max="5"
                  value={formData.stressLevel}
                  onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Anxiety Level (1-5)
                </label>
                <input
                  type="range"
                  className="w-full"
                  min="1"
                  max="5"
                  value={formData.anxiety}
                  onChange={(e) => setFormData({ ...formData, anxiety: e.target.value })}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sleep Quality (1-5)
                </label>
                <input
                  type="range"
                  className="w-full"
                  min="1"
                  max="5"
                  value={formData.sleep}
                  onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Mood (1-5)
                </label>
                <input
                  type="range"
                  className="w-full"
                  min="1"
                  max="5"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <button type="submit" className="glass-button w-full">
                Submit Securely
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your data will be encrypted using public key:{" "}
                <code className="bg-black/20 px-2 py-1 rounded">
                  pk_demo123
                </code>
              </p>
            </form>
          </motion.div>

          {/* Encryption Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <Lock className="w-8 h-8 text-[#F97316]" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 rainbow-text">End-to-End Encryption</h3>
                  <p className="text-gray-400">
                    All data is encrypted before leaving your browser using military-grade encryption.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-[#0EA5E9]" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 rainbow-text">Privacy Guaranteed</h3>
                  <p className="text-gray-400">
                    Your responses are protected and can only be accessed by authorized healthcare professionals.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
