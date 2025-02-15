/**
 * Simulated homomorphic encryption utility
 * In a real implementation, this would use an actual homomorphic encryption library
 */

// Simulated public key - in reality, this would be provided by the server
const MOCK_PUBLIC_KEY = 'mock-public-key-2025';

/**
 * Simulates homomorphic encryption of data
 * @param {Object} data - The data to encrypt
 * @returns {string} - Simulated encrypted data
 */
export const encryptData = (data) => {
  // This is a placeholder encryption simulation
  // In production, use a real homomorphic encryption library
  const mockEncrypted = Buffer.from(JSON.stringify(data)).toString('base64');
  return `encrypted_${mockEncrypted}_${MOCK_PUBLIC_KEY}`;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates age input
 * @param {number} age - Age to validate
 * @returns {boolean} - Whether age is valid
 */
export const isValidAge = (age) => {
  return age >= 0 && age <= 120;
};
