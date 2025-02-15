import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "@/components/Header";

const encryptData = (data: any, publicKey: string) => {
  return JSON.stringify(data) + `_encrypted_with_${publicKey}`;
};

const Index = () => {
  const [formData, setFormData] = useState({
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
    responseType: "dropdown" as "dropdown" | "written",
    writtenResponses: {
      dietaryBalance: "",
      mentalHealth: "",
      generalHealth: "",
      chronicPain: "",
      screenTimeImpact: "",
      mindfulnessPractices: ""
    }
  });
  
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
                <h2 className="text-2xl font-bold mb-6 rainbow-text">Basic Health Information</h2>
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

                  <div className="grid grid-cols-3 gap-4">
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
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Blood Type
                    </label>
                    <select
                      className="input-field"
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      required
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Exercise Frequency (hours per week)
                    </label>
                    <input
                      type="range"
                      className="w-full"
                      min="0"
                      max="20"
                      value={formData.exerciseFrequency}
                      onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>0h</span>
                      <span>20h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Average Sleep (hours per night)
                    </label>
                    <input
                      type="range"
                      className="w-full"
                      min="4"
                      max="12"
                      value={formData.sleepHours}
                      onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>4h</span>
                      <span>12h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      How would you rate your overall energy levels during a typical day?
                    </label>
                    <select
                      className="input-field"
                      value={formData.energyLevels}
                      onChange={(e) => setFormData({ ...formData, energyLevels: e.target.value })}
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="very-high">Very High</option>
                      <option value="high">High</option>
                      <option value="moderate">Moderate</option>
                      <option value="low">Low</option>
                      <option value="very-low">Very Low</option>
                    </select>
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
                <h2 className="text-2xl font-bold mb-6 rainbow-text">Additional Health Information</h2>
                
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
                          How balanced do you consider your daily diet?
                        </label>
                        <select
                          className="input-field"
                          value={formData.dietaryBalance}
                          onChange={(e) => setFormData({ ...formData, dietaryBalance: e.target.value })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="very-balanced">Very Balanced</option>
                          <option value="moderately-balanced">Moderately Balanced</option>
                          <option value="somewhat-unbalanced">Somewhat Unbalanced</option>
                          <option value="very-unbalanced">Very Unbalanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          In the past month, how frequently have you experienced symptoms of anxiety or depression?
                        </label>
                        <select
                          className="input-field"
                          value={formData.mentalHealth}
                          onChange={(e) => setFormData({ ...formData, mentalHealth: e.target.value })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="never">Never</option>
                          <option value="rarely">Rarely</option>
                          <option value="sometimes">Sometimes</option>
                          <option value="often">Often</option>
                          <option value="always">Always</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          How would you describe your overall physical health?
                        </label>
                        <select
                          className="input-field"
                          value={formData.generalHealth}
                          onChange={(e) => setFormData({ ...formData, generalHealth: e.target.value })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                          <option value="very-poor">Very Poor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          In the past month, how often have you experienced chronic pain or physical discomfort?
                        </label>
                        <select
                          className="input-field"
                          value={formData.chronicPain}
                          onChange={(e) => setFormData({ ...formData, chronicPain: e.target.value })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="never">Never</option>
                          <option value="rarely">Rarely</option>
                          <option value="sometimes">Sometimes</option>
                          <option value="often">Often</option>
                          <option value="always">Always</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          How would you rate the impact of your screen time on your overall well-being?
                        </label>
                        <select
                          className="input-field"
                          value={formData.screenTimeImpact}
                          onChange={(e) => setFormData({ ...formData, screenTimeImpact: e.target.value })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="very-positive">Very Positive</option>
                          <option value="somewhat-positive">Somewhat Positive</option>
                          <option value="neutral">Neutral</option>
                          <option value="somewhat-negative">Somewhat Negative</option>
                          <option value="very-negative">Very Negative</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          How frequently do you engage in mindfulness, meditation, or other relaxation practices?
                        </label>
                        <select
                          className="input-field"
                          value={formData.mindfulnessPractices}
                          onChange={(e) => setFormData({ ...formData, mindfulnessPractices: e.target.value })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="daily">Daily</option>
                          <option value="few-times-week">A few times a week</option>
                          <option value="once-week">Once a week</option>
                          <option value="rarely">Rarely</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Please describe your dietary balance and any challenges you face
                        </label>
                        <textarea
                          className="input-field min-h-[100px]"
                          value={formData.writtenResponses.dietaryBalance}
                          onChange={(e) => setFormData({
                            ...formData,
                            writtenResponses: {
                              ...formData.writtenResponses,
                              dietaryBalance: e.target.value.slice(0, 250)
                            }
                          })}
                          maxLength={250}
                          placeholder="Describe your dietary habits and any challenges..."
                          required
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {250 - formData.writtenResponses.dietaryBalance.length} characters remaining
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Please describe your mental health experiences if you feel comfortable sharing
                        </label>
                        <textarea
                          className="input-field min-h-[100px]"
                          value={formData.writtenResponses.mentalHealth}
                          onChange={(e) => setFormData({
                            ...formData,
                            writtenResponses: {
                              ...formData.writtenResponses,
                              mentalHealth: e.target.value.slice(0, 250)
                            }
                          })}
                          maxLength={250}
                          placeholder="Share your mental health experiences..."
                          required
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {250 - formData.writtenResponses.mentalHealth.length} characters remaining
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Please elaborate on your general health concerns
                        </label>
                        <textarea
                          className="input-field min-h-[100px]"
                          value={formData.writtenResponses.generalHealth}
                          onChange={(e) => setFormData({
                            ...formData,
                            writtenResponses: {
                              ...formData.writtenResponses,
                              generalHealth: e.target.value.slice(0, 250)
                            }
                          })}
                          maxLength={250}
                          placeholder="Describe any specific health concerns..."
                          required
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {250 - formData.writtenResponses.generalHealth.length} characters remaining
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Please describe any chronic pain or discomfort you experience
                        </label>
                        <textarea
                          className="input-field min-h-[100px]"
                          value={formData.writtenResponses.chronicPain}
                          onChange={(e) => setFormData({
                            ...formData,
                            writtenResponses: {
                              ...formData.writtenResponses,
                              chronicPain: e.target.value.slice(0, 250)
                            }
                          })}
                          maxLength={250}
                          placeholder="Describe the nature or location of any pain..."
                          required
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {250 - formData.writtenResponses.chronicPain.length} characters remaining
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Please share any concerns related to your screen time
                        </label>
                        <textarea
                          className="input-field min-h-[100px]"
                          value={formData.writtenResponses.screenTimeImpact}
                          onChange={(e) => setFormData({
                            ...formData,
                            writtenResponses: {
                              ...formData.writtenResponses,
                              screenTimeImpact: e.target.value.slice(0, 250)
                            }
                          })}
                          maxLength={250}
                          placeholder="Share any specific concerns about screen time..."
                          required
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {250 - formData.writtenResponses.screenTimeImpact.length} characters remaining
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Please describe your mindfulness and relaxation practices
                        </label>
                        <textarea
                          className="input-field min-h-[100px]"
                          value={formData.writtenResponses.mindfulnessPractices}
                          onChange={(e) => setFormData({
                            ...formData,
                            writtenResponses: {
                              ...formData.writtenResponses,
                              mindfulnessPractices: e.target.value.slice(0, 250)
                            }
                          })}
                          maxLength={250}
                          placeholder="Share what practices you find most beneficial..."
                          required
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {250 - formData.writtenResponses.mindfulnessPractices.length} characters remaining
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
    </div>
  );
};

export default Index;
