
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

// Simulated encryption function
const encryptData = (data: any, publicKey: string) => {
  // In a real implementation, this would use actual encryption
  return JSON.stringify(data) + `_encrypted_with_${publicKey}`;
};

const Form = () => {
  const [searchParams] = useSearchParams();
  const publicKey = searchParams.get("key") || "";
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    stressLevel: "3",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Encrypt the data
      const encryptedData = encryptData(formData, publicKey);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Your response has been securely submitted.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        stressLevel: "3",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Mental Health Survey
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                className="input-field"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
                min="18"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stress Level (1-5)
              </label>
              <input
                type="range"
                className="w-full"
                min="1"
                max="5"
                value={formData.stressLevel}
                onChange={(e) =>
                  setFormData({ ...formData, stressLevel: e.target.value })
                }
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Low Stress</span>
                <span>High Stress</span>
              </div>
            </div>

            <button type="submit" className="glass-button w-full">
              Submit Securely
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your data will be encrypted before submission using public key:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {publicKey || "No key provided"}
              </code>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Form;
