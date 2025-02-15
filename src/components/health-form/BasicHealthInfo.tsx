
import React from 'react';
import { motion } from "framer-motion";
import { HealthFormData } from '@/types/form';

interface BasicHealthInfoProps {
  formData: HealthFormData;
  setFormData: (data: HealthFormData) => void;
}

const BasicHealthInfo: React.FC<BasicHealthInfoProps> = ({ formData, setFormData }) => {
  return (
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
  );
};

export default BasicHealthInfo;
