// Vector mappings for form responses
// Each vector is a 5-element array representing one-hot encoded responses

export const healthFormVectors = {
  // Dietary Balance Vectors
  dietaryBalance: {
    'very-balanced': [1, 0, 0, 0, 0],
    'moderately-balanced': [0, 1, 0, 0, 0],
    'somewhat-unbalanced': [0, 0, 1, 0, 0],
    'very-unbalanced': [0, 0, 0, 1, 0],
  },

  // Mental Health Frequency Vectors
  mentalHealth: {
    'never': [1, 0, 0, 0, 0],
    'rarely': [0, 1, 0, 0, 0],
    'sometimes': [0, 0, 1, 0, 0],
    'often': [0, 0, 0, 1, 0],
    'always': [0, 0, 0, 0, 1],
  },

  // General Health Status Vectors
  generalHealth: {
    'excellent': [1, 0, 0, 0, 0],
    'good': [0, 1, 0, 0, 0],
    'fair': [0, 0, 1, 0, 0],
    'poor': [0, 0, 0, 1, 0],
    'very-poor': [0, 0, 0, 0, 1],
  },

  // Chronic Pain Frequency Vectors
  chronicPain: {
    'never': [1, 0, 0, 0, 0],
    'rarely': [0, 1, 0, 0, 0],
    'sometimes': [0, 0, 1, 0, 0],
    'often': [0, 0, 0, 1, 0],
    'always': [0, 0, 0, 0, 1],
  },

  // Screen Time Impact Vectors
  screenTimeImpact: {
    'very-positive': [1, 0, 0, 0, 0],
    'somewhat-positive': [0, 1, 0, 0, 0],
    'neutral': [0, 0, 1, 0, 0],
    'somewhat-negative': [0, 0, 0, 1, 0],
    'very-negative': [0, 0, 0, 0, 1],
  },

  // Mindfulness Practice Frequency Vectors
  mindfulnessPractices: {
    'daily': [1, 0, 0, 0, 0],
    'few-times-week': [0, 1, 0, 0, 0],
    'once-week': [0, 0, 1, 0, 0],
    'rarely': [0, 0, 0, 1, 0],
    'never': [0, 0, 0, 0, 1],
  },
};

// Helper function to get vector representation for a response
export const getResponseVector = (category: keyof typeof healthFormVectors, response: string): number[] => {
  const categoryVectors = healthFormVectors[category];
  return categoryVectors[response] || Array(5).fill(0);
};
