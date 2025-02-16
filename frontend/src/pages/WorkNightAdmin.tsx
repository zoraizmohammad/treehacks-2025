import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Users, FileText, Settings, Database, ChevronDown, ChevronUp, ExternalLink, UserRound, Table } from "lucide-react";
import Header from "@/components/Header";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/worknight/StatsCard";
import QuickActions from "@/components/worknight/QuickActions";
import DemographicInsights from "@/components/worknight/DemographicInsights";
import { AggregationButton } from "@/components/AggregationButton";
import CSVViewer from "@/components/worknight/CSVViewer";

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

interface WorkNightAdminProps {
  aggregateData: number[];
}

const WorkNightAdmin = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isRawDataOpen, setIsRawDataOpen] = useState(false);
  const [latestCandidate, setLatestCandidate] = useState<LatestCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aggregateData, setAggregateData] = useState<number[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [aggregateError, setAggregateError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({ status: "Operational", lastCheck: "Just now" });
  const defaultAggregateData = Array(18).fill(0);

  useEffect(() => {
    // Fetch aggregate data
    fetch('http://localhost:18080/aggregate', { method: 'POST' })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || 'Network error');
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.decrypted && Array.isArray(data.decrypted)) {
          setAggregateData(data.decrypted);
        } else {
          setAggregateData(defaultAggregateData);
        }
      })
      .catch((err) => {
        setAggregateError(err.message);
        setAggregateData(defaultAggregateData);
      });
  }, []);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch all transactions for total count
        const totalResponse = await fetch(`https://api-holesky.etherscan.io/api?module=account&action=txlist&address=0xBE384aa1b5a393f79A1dfe5aa6cFD96aF7250867&page=1&offset=10000&sort=desc&apikey=KBENR239TJX9PM81K6HTHS6GX1V3AP716H`);
        const totalData = await totalResponse.json();
        
        // Fetch only the most recent transaction
        const recentResponse = await fetch(`https://api-holesky.etherscan.io/api?module=account&action=txlist&address=0xBE384aa1b5a393f79A1dfe5aa6cFD96aF7250867&page=1&offset=1&sort=desc&apikey=KBENR239TJX9PM81K6HTHS6GX1V3AP716H`);
        const recentData = await recentResponse.json();
        
        if (totalData.status === "1") {
          // Update total count
          setTotalApplications(totalData.result.length);
        }
        
        if (recentData.status === "1" && recentData.result.length > 0) {
          const transactions = recentData.result.map((tx: any) => ({
            hash: tx.hash,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
            timeMs: parseInt(tx.timeStamp) * 1000,
            from: tx.from,
            to: tx.to,
            value: `${(parseInt(tx.value) / 1e18).toFixed(4)} ETH`,
            status: tx.isError === "0" ? "Success" : "Failed"
          }));

          // Update recent transactions (will only be the most recent one)
          setRecentTransactions(transactions);

          // Update system status based on recent transactions from total data
          const last5Transactions = totalData.result.slice(0, 5).map((tx: any) => ({
            status: tx.isError === "0" ? "Success" : "Failed"
          }));
          const allSuccessful = last5Transactions.every(tx => tx.status === "Success");
          
          // Calculate time since last transaction
          const lastTransactionTime = parseInt(totalData.result[0].timeStamp) * 1000;
          const currentTime = Date.now();
          const timeDiff = currentTime - lastTransactionTime;
          
          // Format time difference
          let lastCheck;
          if (timeDiff < 60000) { // less than 1 minute
            lastCheck = 'Just now';
          } else if (timeDiff < 3600000) { // less than 1 hour
            const minutes = Math.floor(timeDiff / 60000);
            lastCheck = `${minutes}m ago`;
          } else if (timeDiff < 86400000) { // less than 1 day
            const hours = Math.floor(timeDiff / 3600000);
            lastCheck = `${hours}h ago`;
          } else {
            const days = Math.floor(timeDiff / 86400000);
            lastCheck = `${days}d ago`;
          }

          setSystemStatus({
            status: allSuccessful ? "Operational" : "Degraded",
            lastCheck
          });
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setSystemStatus({
          status: "Error",
          lastCheck: "Check failed"
        });
        setRecentTransactions([]);
      }
    };

    fetchTransactions();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTransactions, 300000);
    return () => clearInterval(interval);
  }, []);

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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatsCard
              icon={Users}
              title="Total Users"
              value={totalApplications}
              subtext="All-time transactions"
              subtextColor="text-green-600"
              delay={0.1}
            />
            <StatsCard
              icon={UserRound}
              title="Average Response Time"
              value="3.2"
              subtext="Days"
              delay={0.2}
            />
            <StatsCard
              icon={Database}
              title="System Status"
              value={systemStatus.status}
              subtext={`Last check: ${systemStatus.lastCheck}`}
              delay={0.3}
              type={systemStatus.status.toLowerCase()}
            />
          </div>

          {/* Demographic Insights */}
          {aggregateError ? (
            <div className="p-4 text-red-600">Error: {aggregateError}</div>
          ) : (
            <DemographicInsights data={aggregateData} />
          )}

          {/* Quick Actions */}
          <QuickActions />

          {/* Development Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
                {/* Latest Candidate Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0066CC] flex items-center gap-2">
                      <UserRound className="w-5 h-5" />
                      Latest Candidate Information
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
                      <div className="grid grid-cols-3 gap-2">
                        {(aggregateData.length > 0 ? aggregateData : defaultAggregateData).slice(0, 18).map((value, index) => (
                          <div key={index} className="text-[#0066CC]">
                            {value}
                          </div>
                        ))}
                      </div>
                      {aggregateData.length > 18 && (
                        <div className="text-gray-500 mt-2">... {aggregateData.length - 18} more values</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          {/* Raw Data Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Collapsible
              open={isRawDataOpen}
              onOpenChange={setIsRawDataOpen}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
            >
              <CollapsibleTrigger className="flex items-center gap-3 text-[#0066CC] w-full">
                <Table className="w-5 h-5" />
                <span className="font-medium">View Raw Data</span>
                {isRawDataOpen ? (
                  <ChevronUp className="ml-auto w-5 h-5" />
                ) : (
                  <ChevronDown className="ml-auto w-5 h-5" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-6">
                <CSVViewer />
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkNightAdmin;
