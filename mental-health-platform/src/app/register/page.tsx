'use client';

import { useState } from 'react';
import { generateKeyPair } from '@/utils/encryption';

export default function Register() {
  const [organization, setOrganization] = useState({
    name: '',
    email: '',
    website: '',
  });

  const [keys, setKeys] = useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);

  const [embedCode, setEmbedCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyPair = generateKeyPair();
    setKeys(keyPair);
    
    // Generate embed code
    const code = `<iframe
  src="https://your-domain.com/form?publicKey=${keyPair.publicKey}"
  style="width: 100%; height: 600px; border: none; border-radius: 8px;"
  title="Mental Health Survey"
></iframe>`;
    
    setEmbedCode(code);
  };

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Register Your Organization
          </h1>

          {!keys ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={organization.name}
                    onChange={(e) => setOrganization(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={organization.email}
                    onChange={(e) => setOrganization(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="website" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={organization.website}
                    onChange={(e) => setOrganization(prev => ({
                      ...prev,
                      website: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Keys
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Encryption Keys</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Public Key:</p>
                  <code className="text-sm break-all">{keys.publicKey}</code>
                </div>
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Private Key:</p>
                  <code className="text-sm break-all">{keys.privateKey}</code>
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Store this private key securely. It will not be shown again.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <code className="text-sm break-all whitespace-pre-wrap">
                    {embedCode}
                  </code>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Next Steps</h3>
                <ol className="list-decimal list-inside text-blue-700 space-y-2">
                  <li>Save your private key securely</li>
                  <li>Copy the embed code</li>
                  <li>Add the form to your website</li>
                  <li>Start collecting encrypted data</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
