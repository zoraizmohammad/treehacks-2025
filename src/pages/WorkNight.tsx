
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";

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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    university: "",
    major: "",
    graduationDate: "",
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

const WorkNight = () => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "Your application has been received.",
    });
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
    setCurrentStep(2);
    toast({
      title: "Progress Saved",
      description: "Your information has been saved. Moving to next section.",
    });
  };

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
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
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
                <h2 className="text-xl font-semibold mb-6 text-black">Self Identification</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Gender
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      value={formData.voluntaryDisclosure.gender}
                      onChange={(e) => setFormData({
                        ...formData,
                        voluntaryDisclosure: { ...formData.voluntaryDisclosure, gender: e.target.value }
                      })}
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
                      Race/Ethnicity
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                      value={formData.voluntaryDisclosure.ethnicity}
                      onChange={(e) => setFormData({
                        ...formData,
                        voluntaryDisclosure: { ...formData.voluntaryDisclosure, ethnicity: e.target.value }
                      })}
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
