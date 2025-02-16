
import React from "react";
import { motion } from "framer-motion";
import { 
  Lock, 
  Database, 
  Calculator, 
  Key, 
  Server, 
  Shield, 
  FileText,
  ChevronRight,
  Users
} from "lucide-react";

const WorkflowSection = () => {
  const steps = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Client-Side Encryption",
      description: "Data is encrypted on the customer's device using homomorphic public key before transmission",
      color: "from-teal-400 to-cyan-300"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Secure Storage",
      description: "Encrypted data (ciphertext) is securely stored, ensuring individual values remain private",
      color: "from-cyan-400 to-blue-400"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Statistics Request",
      description: "Company requests aggregated statistics through smart contract verification",
      color: "from-blue-400 to-indigo-400"
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Aggregator Processing",
      description: "Homomorphic operations compute statistics without decrypting individual records",
      color: "from-indigo-400 to-purple-400"
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: "Final Decryption",
      description: "Only aggregated results are decrypted, maintaining individual privacy",
      color: "from-purple-400 to-pink-400"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">
            How CipherShield Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our innovative system ensures complete privacy while enabling valuable insights
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center mb-8 relative"
            >
              <div className={`glass-card p-6 flex-1 flex items-start gap-6 hover:transform hover:scale-102 transition-all duration-300`}>
                <div className={`p-4 rounded-lg bg-gradient-to-r ${step.color} bg-opacity-10 backdrop-blur-sm`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                  <ChevronRight className="w-6 h-6 text-teal-300" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 inline-block">
            <div className="flex items-center gap-4 justify-center">
              <Shield className="w-8 h-8 text-teal-300" />
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-white">Privacy Guarantee:</span>{" "}
                Minimum of 10 records required for any statistical computation
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowSection;
