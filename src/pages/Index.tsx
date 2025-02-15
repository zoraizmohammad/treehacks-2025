
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const generatePublicKey = () => {
  return `pk_${Math.random().toString(36).substring(2, 15)}`;
};

const Index = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    studentCount: "",
    dataTypes: [] as string[],
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publicKey = generatePublicKey();
    
    toast({
      title: "Encryption Key Generated!",
      description: `Your public key is: ${publicKey}`,
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
            Secure Mental Health Data Collection
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            End-to-end encrypted data collection for universities
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
            <h2 className="text-2xl font-bold mb-6 rainbow-text">Register Your Organization</h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                />
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
                  Number of Students
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Collection Types
                </label>
                <div className="space-y-2">
                  {["Mental Health Surveys", "Wellness Checks", "Counseling Feedback", "Anonymous Reports"].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-black/20 text-[#0EA5E9]"
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.dataTypes, type]
                            : formData.dataTypes.filter(t => t !== type);
                          setFormData({ ...formData, dataTypes: newTypes });
                        }}
                      />
                      <span className="text-sm text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="glass-button w-full">
                Generate Encryption Key
              </button>
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
                    All data is encrypted before leaving the student's browser using military-grade encryption.
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
                    Your organization holds the only keys that can decrypt the data. We never see the raw information.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <Key className="w-8 h-8 text-[#F97316]" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 rainbow-text">Simple Integration</h3>
                  <p className="text-gray-400">
                    Embed our secure form into your existing systems with a single line of code.
                  </p>
                  <pre className="mt-4 bg-black/40 p-4 rounded-lg text-sm overflow-x-auto text-gray-300">
                    {`<iframe src="https://your-domain.com/form?key=YOUR_KEY" />`}
                  </pre>
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
