
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Shield, Database, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const generatePublicKey = () => {
  // Simulated key generation
  return `pk_${Math.random().toString(36).substring(2, 15)}`;
};

const Index = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const publicKey = generatePublicKey();
    
    toast({
      title: "Registration Successful!",
      description: `Your public key is: ${publicKey}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Mental Health Data Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Privacy-first solution for universities to collect and analyze mental health data
            with client-side encryption.
          </p>
          <button className="glass-button">
            Get Started <ArrowRight className="inline-block ml-2" size={16} />
          </button>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-6"
            >
              <Lock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client-Side Encryption</h3>
              <p className="text-gray-600">
                Data is encrypted before leaving the student's browser, ensuring maximum privacy.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-6"
            >
              <Database className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Encrypted data is stored safely, accessible only with your organization's keys.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card p-6"
            >
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600">
                Advanced security measures protect sensitive mental health information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Register Your Organization</h2>
          <div className="glass-card p-8">
            <form onSubmit={handleRegistration}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="glass-button w-full">
                  Generate Public Key
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Embed Instructions */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Easy Integration
          </h2>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
              <Code className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Embed Our Form
                </h3>
                <p className="text-gray-600 mb-4">
                  Simply add our form component to your existing mental health surveys:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {`<iframe
  src="https://your-domain.com/form?key=YOUR_PUBLIC_KEY"
  width="100%"
  height="600px"
  frameBorder="0"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2024 Mental Health Data Haven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
