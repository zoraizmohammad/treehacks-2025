
import React from 'react';
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HealthFormData } from '@/types/form';

interface AdditionalHealthInfoProps {
  formData: HealthFormData;
  setFormData: (data: HealthFormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const AdditionalHealthInfo: React.FC<AdditionalHealthInfoProps> = ({ 
  formData, 
  setFormData,
  handleSubmit 
}) => {
  return (
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
  );
};

export default AdditionalHealthInfo;
