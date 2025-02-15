/**
 * Utility functions for encryption and key generation
 */

/**
 * Generates a simulated public/private key pair
 * In production, this would use actual cryptographic key generation
 */
export const generateKeyPair = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return {
    publicKey: `pub_${timestamp}_${randomString}`,
    privateKey: `priv_${timestamp}_${randomString}`,
  };
};

/**
 * Simulates encryption of data using a public key
 * In production, this would use actual homomorphic encryption
 */
export const encryptData = (data: any, publicKey: string) => {
  // In production, this would use actual encryption
  const encryptedData = JSON.stringify(data);
  return `${publicKey}_encrypted_${Buffer.from(encryptedData).toString('base64')}`;
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates age input
 */
export const isValidAge = (age: number): boolean => {
  return age >= 0 && age <= 120;
};

/**
 * Validates stress level input (1-10)
 */
export const isValidStressLevel = (level: number): boolean => {
  return level >= 1 && level <= 10;
};
