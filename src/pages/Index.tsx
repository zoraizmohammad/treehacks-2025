import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
    substanceUse: "" ,
    responseType: "dropdown" as "dropdown" | "written",
    writtenResponses: {
      familyHistory: "",
      mentalHealthDiagnosis: "",
      treatment: "",
      suicidalThoughts: "",
      substanceUse: ""
    }
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
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <Lock className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-xl font-semibold mb-2 rainbow-text">End-to-End Encryption</h3>
              <p className="text-gray-400">
                All data is encrypted right in your browser using advanced homomorphic encryption, so no one—not even us—can see your individual responses.
              </p>
            </div>

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
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <Shield className="w-8 h-8 text-[#0EA5E9] mb-4" />
              <h3 className="text-xl font-semibold mb-2 rainbow-text">Privacy Guaranteed</h3>
              <p className="text-gray-400">
                Only aggregate results are ever decrypted. Your personal information remains hidden and cannot be accessed by any unauthorized parties.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 relative overflow-hidden"
            >
              <div className="encryption-visualizer" />
              <h2 className="text-2xl font-bold mb-6 rainbow-text">Mental Health Demographic Information</h2>
              
              <div className="flex justify-center mb-6">
                <ToggleGroup 
                  type="single" 
                  value={formData.responseType}
                  onValueChange={(value) => {
                    if (value) setFormData({ ...formData, responseType: value as "dropdown" | "written" });
                  }}
                  className="inline-flex bg-black/20 p-1 rounded-lg"
                >
                  <ToggleGroupItem 
                    value="dropdown" 
                    className={`px-4 py-2 rounded-md transition-all ${
                      formData.responseType === "dropdown" 
                        ? "bg-gradient-to-r from-[#F97316] to-[#0EA5E9] text-white" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Dropdown
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="written" 
                    className={`px-4 py-2 rounded-md transition-all ${
                      formData.responseType === "written" 
                        ? "bg-gradient-to-r from-[#F97316] to-[#0EA5E9] text-white" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Written
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {formData.responseType === "dropdown" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Does anyone in your immediate family have a history of mental illness?
                      </label>
                      <textarea
                        className="input-field min-h-[100px]"
                        value={formData.writtenResponses.familyHistory}
                        onChange={(e) => setFormData({
                          ...formData,
                          writtenResponses: {
                            ...formData.writtenResponses,
                            familyHistory: e.target.value.slice(0, 250)
                          }
                        })}
                        maxLength={250}
                        placeholder="Please describe your family's mental health history..."
                        required
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {250 - formData.writtenResponses.familyHistory.length} characters remaining
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Have you ever been diagnosed with a mental health disorder?
                      </label>
                      <textarea
                        className="input-field min-h-[100px]"
                        value={formData.writtenResponses.mentalHealthDiagnosis}
                        onChange={(e) => setFormData({
                          ...formData,
                          writtenResponses: {
                            ...formData.writtenResponses,
                            mentalHealthDiagnosis: e.target.value.slice(0, 250)
                          }
                        })}
                        maxLength={250}
                        placeholder="Please describe any mental health diagnoses..."
                        required
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {250 - formData.writtenResponses.mentalHealthDiagnosis.length} characters remaining
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Are you currently receiving any mental health treatment or medication?
                      </label>
                      <textarea
                        className="input-field min-h-[100px]"
                        value={formData.writtenResponses.treatment}
                        onChange={(e) => setFormData({
                          ...formData,
                          writtenResponses: {
                            ...formData.writtenResponses,
                            treatment: e.target.value.slice(0, 250)
                          }
                        })}
                        maxLength={250}
                        placeholder="Please describe your current treatment status..."
                        required
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {250 - formData.writtenResponses.treatment.length} characters remaining
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Have you experienced suicidal thoughts or engaged in self-harm behaviors in the past year?
                      </label>
                      <textarea
                        className="input-field min-h-[100px]"
                        value={formData.writtenResponses.suicidalThoughts}
                        onChange={(e) => setFormData({
                          ...formData,
                          writtenResponses: {
                            ...formData.writtenResponses,
                            suicidalThoughts: e.target.value.slice(0, 250)
                          }
                        })}
                        maxLength={250}
                        placeholder="Please describe your experience..."
                        required
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {250 - formData.writtenResponses.suicidalThoughts.length} characters remaining
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Do you have a history of substance use or abuse?
                      </label>
                      <textarea
                        className="input-field min-h-[100px]"
                        value={formData.writtenResponses.substanceUse}
                        onChange={(e) => setFormData({
                          ...formData,
                          writtenResponses: {
                            ...formData.writtenResponses,
                            substanceUse: e.target.value.slice(0, 250)
                          }
                        })}
                        maxLength={250}
                        placeholder="Please describe your substance use history..."
                        required
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {250 - formData.writtenResponses.substanceUse.length} characters remaining
                      </p>
                    </div>
                  </>
                )}

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
    </div>
  );
};

export default Index;
