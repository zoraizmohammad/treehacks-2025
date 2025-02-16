
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
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            How CipherShield Works
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Our innovative system ensures complete privacy while enabling valuable insights
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative space-y-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <div className="flex items-center justify-center">
                <div className={`glass-card p-8 w-full max-w-3xl liquid-motion isometric-card
                  hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] transition-all duration-300`}>
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${step.color} 
                      bg-opacity-10 backdrop-blur-sm transform transition-transform duration-300 
                      hover:scale-110 hover:rotate-[360deg]`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-200">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className="h-12 w-0.5 bg-gradient-to-b from-teal-400 to-cyan-400 opacity-50" />
                  <ChevronRight className="w-6 h-6 text-teal-300 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="glass-card p-8 inline-block liquid-motion">
            <div className="flex items-center gap-4 justify-center">
              <Shield className="w-8 h-8 text-teal-300" />
              <p className="text-lg text-gray-200">
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
