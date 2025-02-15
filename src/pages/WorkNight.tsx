
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

  return (
    <div className="min-h-screen bg-black">
      <Header isWorkNight />
      <div className="text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-6 text-white">
              Developer Technology Intern, AI - Summer 2025
            </h1>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Application Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>My Information & Experiences</span>
              <span>Encrypted Disclosures and Self Identification</span>
            </div>
          </div>

          <Tabs defaultValue="info" className="glass-card p-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="info"
                onClick={() => setCurrentStep(1)}
                className="text-white"
              >
                My Information & Experiences
              </TabsTrigger>
              <TabsTrigger 
                value="disclosures"
                onClick={() => setCurrentStep(2)}
                className="text-white"
              >
                Encrypted Disclosures
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={formData.personalInfo.firstName}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={formData.personalInfo.lastName}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      required
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="input-field"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    value={formData.personalInfo.university}
                    onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, university: e.target.value }
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Major <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={formData.personalInfo.major}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, major: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expected Graduation Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      required
                      value={formData.personalInfo.graduationDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, graduationDate: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="disclosures">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Voluntary Self-Identification</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Submission of this information is voluntary and refusal to provide it will not subject you to any adverse treatment.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age Range
                  </label>
                  <select
                    className="input-field"
                    value={formData.voluntaryDisclosure.ageRange}
                    onChange={(e) => setFormData({
                      ...formData,
                      voluntaryDisclosure: { ...formData.voluntaryDisclosure, ageRange: e.target.value }
                    })}
                  >
                    <option value="">Select an option</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45+">45+</option>
                    <option value="decline">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    className="input-field"
                    value={formData.voluntaryDisclosure.gender}
                    onChange={(e) => setFormData({
                      ...formData,
                      voluntaryDisclosure: { ...formData.voluntaryDisclosure, gender: e.target.value }
                    })}
                  >
                    <option value="">Select an option</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                    <option value="decline">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Race/Ethnicity
                  </label>
                  <select
                    className="input-field"
                    value={formData.voluntaryDisclosure.ethnicity}
                    onChange={(e) => setFormData({
                      ...formData,
                      voluntaryDisclosure: { ...formData.voluntaryDisclosure, ethnicity: e.target.value }
                    })}
                  >
                    <option value="">Select an option</option>
                    <option value="asian">Asian</option>
                    <option value="black">Black or African American</option>
                    <option value="hispanic">Hispanic or Latino</option>
                    <option value="native">Native American or Alaska Native</option>
                    <option value="pacific">Native Hawaiian or Pacific Islander</option>
                    <option value="white">White</option>
                    <option value="multiple">Two or More Races</option>
                    <option value="decline">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Disability Status
                  </label>
                  <select
                    className="input-field"
                    value={formData.voluntaryDisclosure.disability}
                    onChange={(e) => setFormData({
                      ...formData,
                      voluntaryDisclosure: { ...formData.voluntaryDisclosure, disability: e.target.value }
                    })}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes, I have a disability</option>
                    <option value="no">No, I don't have a disability</option>
                    <option value="decline">Prefer not to say</option>
                  </select>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WorkNight;
