'use client';

import React, { useState } from 'react';
import { encryptData, isValidEmail, isValidAge, isValidStressLevel } from '@/utils/encryption';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  stressLevel: string;
}

interface Props {
  publicKey: string;
  apiEndpoint?: string;
}

const SecureForm: React.FC<Props> = ({ 
  publicKey, 
  apiEndpoint = 'https://api.example.com/submit' 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    stressLevel: '',
  });

  const [status, setStatus] = useState({
    message: '',
    type: '' as 'success' | 'error' | '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    const age = parseInt(formData.age);
    if (!formData.age || !isValidAge(age)) {
      newErrors.age = 'Please enter a valid age (0-120)';
    }

    const stressLevel = parseInt(formData.stressLevel);
    if (!formData.stressLevel || !isValidStressLevel(stressLevel)) {
      newErrors.stressLevel = 'Please enter a stress level (1-10)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus({
        message: 'Please correct the errors in the form',
        type: 'error'
      });
      return;
    }

    try {
      // Encrypt the form data using the organization's public key
      const encryptedData = encryptData(formData, publicKey);
      
      // Submit encrypted data
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      // Clear form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        stressLevel: '',
      });

      setStatus({
        message: 'Your response has been securely submitted.',
        type: 'success'
      });
    } catch (error) {
      setStatus({
        message: 'Failed to submit form. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Confidential Health Survey
      </h2>
      
      {status.message && (
        <div className={`p-4 rounded-md mb-6 ${
          status.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : ''
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : ''
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.age ? 'border-red-500' : ''
            }`}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age}</p>
          )}
        </div>

        <div>
          <label htmlFor="stressLevel" className="block text-sm font-medium text-gray-700">
            Stress Level (1-10)
          </label>
          <input
            type="number"
            id="stressLevel"
            name="stressLevel"
            min="1"
            max="10"
            value={formData.stressLevel}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.stressLevel ? 'border-red-500' : ''
            }`}
          />
          {errors.stressLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.stressLevel}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Securely
        </button>
      </form>
    </div>
  );
};

export default SecureForm;
