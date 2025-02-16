// Vector mappings for self identification responses
// Each vector is a one-hot encoded array

export const selfIdentificationVectors = {
  // Age Range Vectors (6 options)
  ageRange: {
    '18-24': [1, 0, 0, 0, 0, 0],
    '25-34': [0, 1, 0, 0, 0, 0],
    '35-44': [0, 0, 1, 0, 0, 0],
    '45-54': [0, 0, 0, 1, 0, 0],
    '55+': [0, 0, 0, 0, 1, 0],
    'decline': [0, 0, 0, 0, 0, 1]
  },

  // Disability Status Vectors (3 options)
  disability: {
    'yes': [1, 0, 0],
    'no': [0, 1, 0],
    'decline': [0, 0, 1]
  },

  // Gender Vectors (4 options)
  gender: {
    'male': [1, 0, 0, 0],
    'female': [0, 1, 0, 0],
    'non-binary': [0, 0, 1, 0],
    'decline': [0, 0, 0, 1]
  },

  // Race/Ethnicity Vectors (5 options)
  ethnicity: {
    'asian': [1, 0, 0, 0, 0],
    'black': [0, 1, 0, 0, 0],
    'hispanic': [0, 0, 1, 0, 0],
    'white': [0, 0, 0, 1, 0],
    'decline': [0, 0, 0, 0, 1]
  }
};

// Helper function to get vector representation for a response
export const getSelfIdVector = (category: keyof typeof selfIdentificationVectors, response: string): number[] => {
  const categoryVectors = selfIdentificationVectors[category];
  return categoryVectors[response] || Array(Object.keys(categoryVectors).length).fill(0);
};
