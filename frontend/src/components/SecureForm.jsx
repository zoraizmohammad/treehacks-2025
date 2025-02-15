import React, { useState } from 'react';
import { encryptData, isValidEmail, isValidAge } from '../utils/encryption';
import './SecureForm.css';

const SecureForm = ({ apiEndpoint = 'https://api.example.com/submit' }) => {
  // Form state management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
  });

  // Status management for form submission
  const [status, setStatus] = useState({
    message: '',
    type: '', // 'success' or 'error'
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.age || !isValidAge(Number(formData.age))) {
      newErrors.age = 'Please enter a valid age (0-120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setStatus({
        message: 'Please correct the errors in the form',
        type: 'error'
      });
      return;
    }

    try {
      // Encrypt the form data
      const encryptedData = encryptData(formData);
      
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
      });

      setStatus({
        message: 'Form submitted successfully!',
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
    <div className="secure-form-container">
      <h2>Secure Information Form</h2>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="secure-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <span className="error-text">{errors.age}</span>}
        </div>

        <button type="submit" className="submit-button">
          Submit Securely
        </button>
      </form>
    </div>
  );
};

export default SecureForm;
