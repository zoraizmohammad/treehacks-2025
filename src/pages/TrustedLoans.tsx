
import { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const initialFormData = {
  personal: {
    fullName: "",
    dateOfBirth: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  },
  employment: {
    status: "",
    employerName: "",
    employerPhone: "",
    annualIncome: "",
    loanAmount: "",
    loanPurpose: "",
  },
  demographics: {
    race: "",
    ethnicity: "",
    gender: "",
    maritalStatus: "",
    ageGroup: "",
  },
};

const TrustedLoans = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === 1) {
      const { fullName, dateOfBirth, ssn, address, city, state, zipCode, phone, email } = formData.personal;
      if (!fullName || !dateOfBirth || !ssn || !address || !city || !state || !zipCode || !phone || !email) {
        toast({
          title: "Required Fields Missing",
          description: "Please fill out all required fields before continuing.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      const { status, employerName, employerPhone, annualIncome, loanAmount, loanPurpose } = formData.employment;
      if (!status || !employerName || !employerPhone || !annualIncome || !loanAmount || !loanPurpose) {
        toast({
          title: "Required Fields Missing",
          description: "Please fill out all required fields before continuing.",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { race, ethnicity, gender, maritalStatus, ageGroup } = formData.demographics;
    if (!race || !ethnicity || !gender || !maritalStatus || !ageGroup) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application Submitted!",
      description: "Your loan application has been received.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isTrustedLoans />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#0FA0CE] mb-4">Personal Loan Application</h1>
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-gray-100" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Personal Info</span>
              <span>Employment & Loan</span>
              <span>Demographics</span>
            </div>
          </div>
        </motion.div>

        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal & Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.personal.fullName}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: { ...formData.personal, fullName: e.target.value }
                    })}
                    placeholder="Enter your full legal name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.dateOfBirth}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, dateOfBirth: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Social Security Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.ssn}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, ssn: e.target.value }
                      })}
                      placeholder="XXX-XX-XXXX"
                      required
                      maxLength={9}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.personal.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: { ...formData.personal, address: e.target.value }
                    })}
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, city: e.target.value }
                      })}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, state: e.target.value }
                      })}
                      required
                    >
                      <option value="">Select</option>
                      <option value="CA">California</option>
                      {/* Add other states as needed */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, zipCode: e.target.value }
                      })}
                      placeholder="ZIP"
                      required
                      maxLength={5}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, phone: e.target.value }
                      })}
                      placeholder="(XXX) XXX-XXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.personal.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: { ...formData.personal, email: e.target.value }
                      })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Employment & Loan Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.employment.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      employment: { ...formData.employment, status: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="full-time">Employed Full-Time</option>
                    <option value="part-time">Employed Part-Time</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.employment.employerName}
                      onChange={(e) => setFormData({
                        ...formData,
                        employment: { ...formData.employment, employerName: e.target.value }
                      })}
                      placeholder="Enter employer name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employer Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.employment.employerPhone}
                      onChange={(e) => setFormData({
                        ...formData,
                        employment: { ...formData.employment, employerPhone: e.target.value }
                      })}
                      placeholder="(XXX) XXX-XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Income <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.employment.annualIncome}
                      onChange={(e) => setFormData({
                        ...formData,
                        employment: { ...formData.employment, annualIncome: e.target.value }
                      })}
                      placeholder="Enter annual income"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                      value={formData.employment.loanAmount}
                      onChange={(e) => setFormData({
                        ...formData,
                        employment: { ...formData.employment, loanAmount: e.target.value }
                      })}
                      placeholder="Enter desired loan amount"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Loan <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.employment.loanPurpose}
                    onChange={(e) => setFormData({
                      ...formData,
                      employment: { ...formData.employment, loanPurpose: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Purpose</option>
                    <option value="mortgage">Mortgage Purchase</option>
                    <option value="home-improvement">Home Improvement</option>
                    <option value="debt-consolidation">Debt Consolidation</option>
                    <option value="education">Education</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Demographic Information</h2>
              <p className="text-sm text-gray-600 mb-6">
                These questions are collected to comply with federal reporting requirements and support our commitment to fair lending. Your responses are used solely for statistical monitoring.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Race <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.demographics.race}
                    onChange={(e) => setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, race: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Race</option>
                    <option value="american-indian">American Indian or Alaska Native</option>
                    <option value="asian">Asian</option>
                    <option value="black">Black or African American</option>
                    <option value="pacific-islander">Native Hawaiian or Other Pacific Islander</option>
                    <option value="white">White</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ethnicity <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.demographics.ethnicity}
                    onChange={(e) => setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, ethnicity: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Ethnicity</option>
                    <option value="hispanic">Hispanic or Latino</option>
                    <option value="not-hispanic">Not Hispanic or Latino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.demographics.gender}
                    onChange={(e) => setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, gender: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other/Prefer not to disclose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.demographics.maritalStatus}
                    onChange={(e) => setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, maritalStatus: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="prefer-not">Prefer not to disclose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent"
                    value={formData.demographics.ageGroup}
                    onChange={(e) => setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, ageGroup: e.target.value }
                    })}
                    required
                  >
                    <option value="">Select Age Group</option>
                    <option value="under-25">Under 25</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55-64">55-64</option>
                    <option value="65-plus">65 or older</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-[#0FA0CE] text-white rounded-md hover:bg-[#0E90BE]"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="ml-auto px-6 py-2 bg-[#0FA0CE] text-white rounded-md hover:bg-[#0E90BE]"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedLoans;
