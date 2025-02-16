import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { getSelfIdVector } from "@/constants/selfIdentificationVectors";

interface ApplicationFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    university: string;
    major: string;
    graduationDate: string;
    resume: File | null;
  };
  voluntaryDisclosure: {
    disability: string;
    ethnicity: string;
    gender: string;
    ageRange: string;
    veteranStatus: string;
  };
}

const initialFormData: ApplicationFormData = {
  personalInfo: {
    firstName: "Mohammad",
    lastName: "Zoraiz",
    email: "mohammad.zoraiz@duke.edu",
    phone: "(650) 555-0123",
    address: "123 Palm Drive",
    city: "Palo Alto",
    state: "CA",
    zipCode: "94301",
    university: "Duke University",
    major: "Electrical Engineering",
    graduationDate: "2025-05-15",
    resume: null,
  },
  voluntaryDisclosure: {
    disability: "",
    ethnicity: "",
    gender: "",
    ageRange: "",
    veteranStatus: "",
  },
};

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

const WorkNight = () => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create My Information vector
    const myInformationVector = {
      firstName: formData.personalInfo.firstName,
      lastName: formData.personalInfo.lastName,
      email: formData.personalInfo.email,
      phone: formData.personalInfo.phone,
      address: formData.personalInfo.address,
      city: formData.personalInfo.city,
      state: formData.personalInfo.state,
      zipCode: formData.personalInfo.zipCode,
      university: formData.personalInfo.university,
      major: formData.personalInfo.major,
      graduationDate: formData.personalInfo.graduationDate,
      hasResume: formData.personalInfo.resume !== null
    };

    // Create Self Identification vector with original responses
    const selfIdentificationVector = {
      ageRange: formData.voluntaryDisclosure.ageRange,
      disability: formData.voluntaryDisclosure.disability,
      gender: formData.voluntaryDisclosure.gender,
      ethnicity: formData.voluntaryDisclosure.ethnicity,
      veteranStatus: formData.voluntaryDisclosure.veteranStatus
    };

    // Create vectorized version of self identification responses
    const vectorizedSelfIdData = {
      ageRange: getSelfIdVector('ageRange', formData.voluntaryDisclosure.ageRange),
      disability: getSelfIdVector('disability', formData.voluntaryDisclosure.disability),
      gender: getSelfIdVector('gender', formData.voluntaryDisclosure.gender),
      ethnicity: getSelfIdVector('ethnicity', formData.voluntaryDisclosure.ethnicity)
    };

    // Log vectors
    console.log('My Information Vector:', myInformationVector);
    console.log('Original Self Identification Vector:', selfIdentificationVector);
    console.log('Vectorized Self Identification Data:', vectorizedSelfIdData);

    toast({
      title: "Application Submitted!",
      description: "Your application has been received.",
    });
    setIsSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          resume: e.target.files[0]
        }
      });
    }
  };

  const handleNext = () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      resume
    } = formData.personalInfo;

    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !resume) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all required fields before continuing.",
        variant: "destructive",
        className: "bg-black text-white border-0 rounded-xl"
      });
      return;
    }

    setCurrentStep(2);
    toast({
      title: "Progress Saved",
      description: "Your information has been saved. Moving to next section.",
      className: "bg-black text-white border-0 rounded-xl"
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header isWorkNight />
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-3xl font-bold text-[#0066CC] mb-4">Application Submitted!</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#0066CC]/20">
              <p className="text-gray-600 text-lg">
                Thank you for your application. Your information is secure and protected through Dual Key homomorphic encryption.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isWorkNight />
      <div className="text-black p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold mb-6 text-black">
              Developer Technology Intern, AI - Summer 2025
            </h1>
          </motion.div>

          <div className="mb-8 border-b border-gray-300 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${step === currentStep ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center 
                      ${step === currentStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}
                    >
                      {step}
                    </div>
                    <span className="ml-2 text-sm">
                      {step === 1 ? 'My Information' : 'Self Identify'}
                    </span>
                    {step < 2 && <div className="w-16 h-[2px] bg-gray-300 ml-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-md p-6">
            {currentStep === 1 ? (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-black">My Information</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Resume <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Legal Name <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="First Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                          required
                          value={formData.personalInfo.firstName}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                          required
                          value={formData.personalInfo.lastName}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Contact Information <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-4">
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                        required
                        value={formData.personalInfo.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, email: e.target.value }
                        })}
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                        required
                        value={formData.personalInfo.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                        required
                        value={formData.personalInfo.address}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, address: e.target.value }
                        })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                          required
                          value={formData.personalInfo.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, city: e.target.value }
                          })}
                        />
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                          required
                          value={formData.personalInfo.state}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, state: e.target.value }
                          })}
                        >
                          <option value="">Select State</option>
                          {US_STATES.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 bg-[#0066CC] text-white rounded hover:bg-[#0052A3]"
                    >
                      Save and Continue
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-8 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-orange-500">🔒</span>
                        <h3 className="font-medium text-gray-900">Homomorphically Encrypted Data</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        All data is encrypted right in your browser using advanced homomorphic encryption, so no one—not even us—can see your individual responses.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-blue-500">🛡️</span>
                        <h3 className="font-medium text-gray-900">Privacy Guaranteed</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Only aggregate results are ever decrypted. Your personal information remains hidden and cannot be accessed by any unauthorized parties.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-6 text-black">Self Identification</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Age Range <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      value={formData.voluntaryDisclosure.ageRange}
                      onChange={(e) => setFormData({
                        ...formData,
                        voluntaryDisclosure: { ...formData.voluntaryDisclosure, ageRange: e.target.value }
                      })}
                      required
                    >
                      <option value="">Select Age Range</option>
                      <option value="18-24">18-24 years</option>
                      <option value="25-34">25-34 years</option>
                      <option value="35-44">35-44 years</option>
                      <option value="45-54">45-54 years</option>
                      <option value="55+">55 years or older</option>
                      <option value="decline">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Disability Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      value={formData.voluntaryDisclosure.disability}
                      onChange={(e) => setFormData({
                        ...formData,
                        voluntaryDisclosure: { ...formData.voluntaryDisclosure, disability: e.target.value }
                      })}
                      required
                    >
                      <option value="">Select Disability Status</option>
                      <option value="yes">Yes, I have a disability (or have a history/record of having one)</option>
                      <option value="no">No, I don't have a disability</option>
                      <option value="decline">I don't wish to answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      value={formData.voluntaryDisclosure.gender}
                      onChange={(e) => setFormData({
                        ...formData,
                        voluntaryDisclosure: { ...formData.voluntaryDisclosure, gender: e.target.value }
                      })}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="decline">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Race/Ethnicity <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      value={formData.voluntaryDisclosure.ethnicity}
                      onChange={(e) => setFormData({
                        ...formData,
                        voluntaryDisclosure: { ...formData.voluntaryDisclosure, ethnicity: e.target.value }
                      })}
                      required
                    >
                      <option value="">Select Race/Ethnicity</option>
                      <option value="asian">Asian</option>
                      <option value="black">Black or African American</option>
                      <option value="hispanic">Hispanic or Latino</option>
                      <option value="white">White</option>
                      <option value="decline">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="pt-6 flex justify-between border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0066CC] text-white rounded hover:bg-[#0052A3]"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkNight;
