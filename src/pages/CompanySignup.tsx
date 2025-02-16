
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "@/components/ParticleBackground";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const CompanySignup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="container mx-auto max-w-lg px-6 py-16 relative">
        <Button
          variant="ghost"
          className="text-teal-300 absolute top-8 left-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 mt-16"
        >
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">
            Company Registration
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <Input
                type="text"
                placeholder="Enter your company name"
                className="w-full bg-black/20 border-white/10 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Email
              </label>
              <Input
                type="email"
                placeholder="Enter your business email"
                className="w-full bg-black/20 border-white/10 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <Input
                type="text"
                placeholder="Enter your industry"
                className="w-full bg-black/20 border-white/10 text-white"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg transition-all duration-300"
            >
              Register Interest
            </Button>
            
            <p className="text-sm text-gray-400 text-center mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignup;
