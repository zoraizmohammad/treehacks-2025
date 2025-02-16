// Vector mapping functions for loan application data

interface PersonalLoanData {
  fullName: string;
  dateOfBirth: string;
  ssn: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  status: string;
  employerName: string;
  employerPhone: string;
  annualIncome: string;
  loanAmount: string;
  loanPurpose: string;
}

interface DemographicData {
  race: string;
  ethnicity: string;
  gender: string;
  maritalStatus: string;
  ageGroup: string;
}

// Race vector mapping (6 elements)
const raceVector: { [key: string]: number[] } = {
  'american-indian': [1, 0, 0, 0, 0, 0],
  'asian': [0, 1, 0, 0, 0, 0],
  'black': [0, 0, 1, 0, 0, 0],
  'pacific-islander': [0, 0, 0, 1, 0, 0],
  'white': [0, 0, 0, 0, 1, 0],
  'other': [0, 0, 0, 0, 0, 1],
};

// Ethnicity vector mapping (3 elements)
const ethnicityVector: { [key: string]: number[] } = {
  'hispanic': [1, 0, 0],
  'not-hispanic': [0, 1, 0],
  'decline': [0, 0, 1],
};

// Gender vector mapping (4 elements)
const genderVector: { [key: string]: number[] } = {
  'male': [1, 0, 0, 0],
  'female': [0, 1, 0, 0],
  'non-binary': [0, 0, 1, 0],
  'decline': [0, 0, 0, 1],
};

// Marital status vector mapping (4 elements)
const maritalStatusVector: { [key: string]: number[] } = {
  'single': [1, 0, 0, 0],
  'married': [0, 1, 0, 0],
  'divorced': [0, 0, 1, 0],
  'other': [0, 0, 0, 1],
};

// Age group vector mapping (5 elements)
const ageGroupVector: { [key: string]: number[] } = {
  '18-24': [1, 0, 0, 0, 0],
  '25-34': [0, 1, 0, 0, 0],
  '35-44': [0, 0, 1, 0, 0],
  '45-54': [0, 0, 0, 1, 0],
  '55+': [0, 0, 0, 0, 1],
};

export interface PersonalLoanOutput {
  employmentStatus: string;
  loanPurpose: string;
  annualIncome: string;
  loanAmount: string;
}

export const getPersonalLoanData = (data: PersonalLoanData): PersonalLoanOutput => {
  return {
    employmentStatus: data.status,
    loanPurpose: data.loanPurpose,
    annualIncome: data.annualIncome,
    loanAmount: data.loanAmount,
  };
};

export const generateUserRawOutputLoan = (data: DemographicData): number[] => {
  // Concatenate all demographic vectors into a single vector
  return [
    ...(raceVector[data.race] || Array(6).fill(0)),
    ...(ethnicityVector[data.ethnicity] || Array(3).fill(0)),
    ...(genderVector[data.gender] || Array(4).fill(0)),
    ...(maritalStatusVector[data.maritalStatus] || Array(4).fill(0)),
    ...(ageGroupVector[data.ageGroup] || Array(5).fill(0)),
  ];
};
