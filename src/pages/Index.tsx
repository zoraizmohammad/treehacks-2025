
import React from "react";
import ParticleBackground from "@/components/ParticleBackground";
import WorkflowSection from "@/components/WorkflowSection";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Database, Network } from "lucide-react";

const Index = () => {
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
      <section className="relative pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full 
              bg-teal-500/20 text-teal-200 backdrop-blur-sm shadow-lg">
              Introducing CipherShield
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Making discrimination mathematically impossible
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
              Our innovative Web3 protocol ensures complete fairness through mathematical principles,
              creating a truly equitable digital ecosystem.
            </p>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6 text-lg 
              transition-all duration-300 transform hover:scale-105 shadow-[0_4px_16px_rgba(45,212,191,0.3)]">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
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
                className="glass-card p-8 liquid-motion isometric-card"
              >
                <div className="mb-4 p-3 rounded-lg bg-teal-500/10 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-200">
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
