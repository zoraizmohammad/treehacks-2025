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
    mood: "3",
    familyHistory: "",
    mentalHealthDiagnosis: "",
    diagnoses: [] as string[],
    treatment: "",
    suicidalThoughts: "",
    substanceUse: ""
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
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold rainbow-text mb-6">
            Mental Health Assessment
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Your responses are secure and encrypted
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
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
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* First Column - Mental Health Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="encryption-visualizer" />
            <h2 className="text-2xl font-bold mb-6 rainbow-text">Mental Health Metrics</h2>
            <form className="space-y-6 relative z-10">
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
            </form>
          </motion.div>

          {/* Second Column - Mental Health Demographic Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="encryption-visualizer" />
            <h2 className="text-2xl font-bold mb-6 rainbow-text">Mental Health Demographic Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Does anyone in your immediate family have a history of mental illness?
                </label>
                <select
                  className="input-field"
                  value={formData.familyHistory}
                  onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="one">Yes, one immediate family member</option>
                  <option value="multiple">Yes, multiple immediate family members</option>
                  <option value="no">No</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Have you ever been diagnosed with a mental health disorder?
                  </label>
                  <select
                    className="input-field"
                    value={formData.mentalHealthDiagnosis}
                    onChange={(e) => setFormData({ ...formData, mentalHealthDiagnosis: e.target.value })}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {formData.mentalHealthDiagnosis === "yes" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Which diagnosis have you received? (Select all that apply)
                    </label>
                    <div className="space-y-2">
                      {[
                        "Major Depressive Disorder",
                        "Generalized Anxiety Disorder",
                        "Bipolar Disorder",
                        "Schizophrenia",
                        "Post-Traumatic Stress Disorder (PTSD)",
                        "Obsessive-Compulsive Disorder (OCD)",
                        "Other",
                        "Prefer not to say"
                      ].map((diagnosis) => (
                        <label key={diagnosis} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-600 bg-black/20 text-[#0EA5E9]"
                            checked={formData.diagnoses.includes(diagnosis)}
                            onChange={(e) => {
                              const newDiagnoses = e.target.checked
                                ? [...formData.diagnoses, diagnosis]
                                : formData.diagnoses.filter(d => d !== diagnosis);
                              setFormData({ ...formData, diagnoses: newDiagnoses });
                            }}
                          />
                          <span className="text-sm text-gray-300">{diagnosis}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Are you currently receiving any mental health treatment or medication?
                </label>
                <select
                  className="input-field"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="therapy">Yes, receiving therapy only</option>
                  <option value="medication">Yes, receiving medication only</option>
                  <option value="both">Yes, receiving both therapy and medication</option>
                  <option value="none">No, not receiving any treatment</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Have you experienced suicidal thoughts or engaged in self-harm behaviors in the past year?
                </label>
                <select
                  className="input-field"
                  value={formData.suicidalThoughts}
                  onChange={(e) => setFormData({ ...formData, suicidalThoughts: e.target.value })}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="both">Yes, both suicidal thoughts and self-harm behaviors</option>
                  <option value="thoughts">Yes, suicidal thoughts only</option>
                  <option value="behaviors">Yes, self-harm behaviors only</option>
                  <option value="no">No</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Do you have a history of substance use or abuse?
                </label>
                <select
                  className="input-field"
                  value={formData.substanceUse}
                  onChange={(e) => setFormData({ ...formData, substanceUse: e.target.value })}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="current">Yes, currently using</option>
                  <option value="past">Yes, used in the past but not currently</option>
                  <option value="no">No</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
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
        </div>
      </div>
    </div>
  );
};

export default Index;
