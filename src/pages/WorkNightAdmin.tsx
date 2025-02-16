import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Users, FileText, Settings, Database, ChevronDown, ChevronUp, ExternalLink, UserRound } from "lucide-react";
import Header from "@/components/Header";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface LatestCandidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  university: string | null;
  major: string | null;
  created_at: string;
}

const WorkNightAdmin = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [latestCandidate, setLatestCandidate] = useState<LatestCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestCandidate = async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching latest candidate:', error);
      } else if (data) {
        setLatestCandidate(data);
      }
      setIsLoading(false);
    };

    fetchLatestCandidate();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications'
        },
        () => {
          fetchLatestCandidate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const recentTransactions = [
    {
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      timestamp: "2024-03-14 15:30:45",
      from: "0xbe384aa1b5a393f79a1dfe5aa6cfd96af7250867",
      to: "0x9876543210fedcba9876543210fedcba9876543210",
      value: "0.05 ETH",
      status: "Success"
    },
    // Add more mock transactions as needed
  ];

  const mockVectorSet = [
    [0.8234, 0.1234, 0.4567, 0.7890],
    [0.2345, 0.5678, 0.9012, 0.3456],
    [0.6789, 0.0123, 0.4567, 0.8901]
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isWorkNight />
      <div className="text-black p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-[#0066CC]">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor application and candidate data</p>
          </motion.div>

          {/* Latest Candidate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0066CC] flex items-center gap-2">
                  <UserRound className="w-5 h-5" />
                  Latest Candidate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-gray-500">Loading latest candidate data...</div>
                ) : latestCandidate ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-[#0066CC] mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {latestCandidate.first_name} {latestCandidate.last_name}</p>
                          <p><span className="font-medium">Email:</span> {latestCandidate.email}</p>
                          <p><span className="font-medium">Phone:</span> {latestCandidate.phone}</p>
                          <p><span className="font-medium">Location:</span> {latestCandidate.city}, {latestCandidate.state}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0066CC] mb-2">Academic Information</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">University:</span> {latestCandidate.university || 'Not provided'}</p>
                          <p><span className="font-medium">Major:</span> {latestCandidate.major || 'Not provided'}</p>
                          <p><span className="font-medium">Applied:</span> {new Date(latestCandidate.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No candidates found</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#0066CC] mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">Total Applications</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-black">847</div>
                <div className="text-sm text-green-600">+8% from last week</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#0066CC] mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">Average Response Time</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-black">3.2</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#0066CC] mb-4">
                <Database className="w-5 h-5" />
                <span className="font-medium">System Status</span>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-green-600">Operational</div>
                <div className="text-sm text-gray-600">Last check: 5m ago</div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 text-[#0066CC] mb-6">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-medium">Quick Actions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5" />
                Export Applications
              </button>
              
              <button className="p-4 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5" />
                Generate Report
              </button>
              
              <button className="p-4 rounded-lg bg-white border border-[#0066CC] text-[#0066CC] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
                System Settings
              </button>
            </div>
          </motion.div>

          {/* Development Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Collapsible
              open={isDevToolsOpen}
              onOpenChange={setIsDevToolsOpen}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <CollapsibleTrigger className="flex items-center gap-3 text-[#0066CC] w-full">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Development Tools</span>
                {isDevToolsOpen ? (
                  <ChevronUp className="ml-auto w-5 h-5" />
                ) : (
                  <ChevronDown className="ml-auto w-5 h-5" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-6 space-y-6">
                {/* Recent Holesky Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0066CC]">
                      Recent Holesky Testnet Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((tx, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Transaction Hash:</span>
                            <a
                              href={`https://holesky.etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0066CC] hover:underline flex items-center"
                            >
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">From:</span>{" "}
                              <span className="font-mono">{tx.from.slice(0, 8)}...</span>
                            </div>
                            <div>
                              <span className="text-gray-600">To:</span>{" "}
                              <span className="font-mono">{tx.to.slice(0, 8)}...</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Value:</span> {tx.value}
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>{" "}
                              <span className="text-green-600">{tx.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Encrypted Vector Set */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0066CC]">
                      Latest Homomorphically Encrypted Vector Set
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(mockVectorSet, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkNightAdmin;
