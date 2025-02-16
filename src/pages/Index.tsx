
import React from "react";
import ParticleBackground from "@/components/ParticleBackground";
import WorkflowSection from "@/components/WorkflowSection";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Database, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Advanced cryptographic protocols ensuring user privacy and data security",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Decentralized",
      description: "Distributed system architecture eliminating single points of failure",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Transparent",
      description: "Open-source algorithms with mathematical proofs of fairness",
    },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#4A90E2] to-[#5B9BE6] bg-clip-text text-transparent">
              CipherShield
            </h1>
            <motion.img
              src="/lovable-uploads/11ce03c2-ef22-4dc0-b671-3a32a371f99d.png"
              alt="CipherShield Logo"
              className="w-32 h-32 mx-auto mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Making discrimination mathematically impossible through our innovative Web3 protocol,
              ensuring complete fairness through mathematical principles.
            </p>
            <Button 
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white rounded-full px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/company-signup')}
            >
              Companies Sign up Here <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-card p-8 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="mb-4 p-3 rounded-lg bg-[#4A90E2]/10 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <WorkflowSection />
    </div>
  );
};

export default Index;
