
export type FormResponseType = "dropdown" | "written";

export interface WrittenResponses {
  dietaryBalance: string;
  mentalHealth: string;
  generalHealth: string;
  chronicPain: string;
  screenTimeImpact: string;
  mindfulnessPractices: string;
}

export interface HealthFormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  bloodType: string;
  exerciseFrequency: string;
  sleepHours: string;
  sleepQuality: string;
  dietaryBalance: string;
  mentalHealth: string;
  energyLevels: string;
  generalHealth: string;
  chronicPain: string;
  screenTimeImpact: string;
  mindfulnessPractices: string;
  responseType: FormResponseType;
  writtenResponses: WrittenResponses;
}
