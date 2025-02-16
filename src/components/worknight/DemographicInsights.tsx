import { BarChart, Bar, Cell, PieChart, Pie, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const DemographicInsights = () => {
  const donutChartRef = useRef<SVGSVGElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const ageData = [
    { subject: '18-24', A: 30, fulltime: 20, parttime: 10 },
    { subject: '25-34', A: 45, fulltime: 35, parttime: 10 },
    { subject: '35-44', A: 15, fulltime: 12, parttime: 3 },
    { subject: '45-54', A: 7, fulltime: 5, parttime: 2 },
    { subject: '55+', A: 3, fulltime: 2, parttime: 1 },
  ];

  const genderData = [
    { name: 'Male', value: 55 },
    { name: 'Female', value: 40 },
    { name: 'Non-binary', value: 3 },
    { name: 'Other', value: 2 },
  ];

  const disabilityData = [
    { name: 'Yes', value: 15 },
    { name: 'No', value: 75 },
    { name: 'Decline', value: 10 },
  ];

  const ethnicityData = [
    { 
      name: 'Asian', 
      value: 25, 
      ratio: 25, 
      subgroups: {
        eastAsian: 12,
        southAsian: 8,
        southeastAsian: 5
      },
      growth: 15
    },
    { 
      name: 'Black', 
      value: 20, 
      ratio: 20, 
      subgroups: {
        african: 10,
        caribbean: 7,
        other: 3
      },
      growth: 12
    },
    { 
      name: 'Hispanic', 
      value: 15, 
      ratio: 15, 
      subgroups: {
        central: 6,
        south: 5,
        caribbean: 4
      },
      growth: 18
    },
    { 
      name: 'White', 
      value: 35, 
      ratio: 35, 
      subgroups: {
        european: 20,
        northAmerican: 12,
        other: 3
      },
      growth: 8
    },
    { 
      name: 'Other', 
      value: 5, 
      ratio: 5, 
      subgroups: {
        mixed: 3,
        other: 2
      },
      growth: 10
    }
  ];

  const multiLevelData = {
    age: [
      { name: '18-24', value: 30, detail: 'Recent graduates' },
      { name: '25-34', value: 45, detail: 'Early career' },
      { name: '35-44', value: 15, detail: 'Mid career' },
      { name: '45-54', value: 7, detail: 'Senior level' },
      { name: '55+', value: 3, detail: 'Pre-retirement' },
    ],
    gender: [
      { name: 'Male', value: 55 },
      { name: 'Female', value: 40 },
      { name: 'Non-binary', value: 3 },
      { name: 'Decline', value: 2 },
    ],
    ethnicity: [
      { name: 'Asian', value: 25, detail: 'Including East, South, and Southeast Asian' },
      { name: 'Black', value: 20, detail: 'Including African and Caribbean' },
      { name: 'Hispanic', value: 15, detail: 'Including various Latin American regions' },
      { name: 'White', value: 35, detail: 'Including European and North American' },
      { name: 'Decline', value: 5, detail: 'Preferred not to specify' },
    ],
  };

  const COLORS = {
    age: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'],
    gender: ['#6C5B7B', '#C06C84', '#F67280', '#F8B195'],
    ethnicity: ['#355C7D', '#6C5B7B', '#C06C84', '#F67280', '#F8B195'],
    disability: ['#47B39C', '#EC6B56', '#FFC154'],
  };

  useEffect(() => {
    if (!donutChartRef.current) return;

    const svg = d3.select(donutChartRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const createArc = (innerRadiusRatio: number, outerRadiusRatio: number) =>
      d3.arc()
        .innerRadius(radius * innerRadiusRatio)
        .outerRadius(radius * outerRadiusRatio);

    const pie = d3.pie<any>().value((d: any) => d.value);

    const rings = [
      { data: multiLevelData.age, colors: COLORS.age, arc: createArc(0.2, 0.4) },
      { data: multiLevelData.gender, colors: COLORS.gender, arc: createArc(0.5, 0.7) },
      { data: multiLevelData.ethnicity, colors: COLORS.ethnicity, arc: createArc(0.8, 1) },
    ];

    rings.forEach((ring, i) => {
      const path = g
        .selectAll(`path.ring-${i}`)
        .data(pie(ring.data))
        .enter()
        .append('path')
        .attr('class', `ring-${i}`)
        .attr('d', ring.arc as any)
        .attr('fill', (d, j) => ring.colors[j])
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', '2');

      path
        .append('title')
        .text(d => `${d.data.name}: ${d.data.value}%`);
    });

    const legend = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(['Age', 'Gender', 'Ethnicity'])
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(10,${i * 20 + 20})`);

    legend
      .append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d, i) => COLORS[d.toLowerCase() as keyof typeof COLORS][0]);

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
  }, []);

  const calculateAgeStats = () => {
    const total = ageData.reduce((acc, curr) => acc + curr.A, 0);
    const largestGroup = ageData.reduce((prev, curr) => prev.A > curr.A ? prev : curr);
    return {
      total,
      average: (total / ageData.length).toFixed(1),
      largestGroup: `${largestGroup.subject} (${largestGroup.A}%)`
    };
  };

  const calculateEthnicityStats = () => {
    const total = ethnicityData.reduce((acc, curr) => acc + curr.value, 0);
    const avgGrowth = ethnicityData.reduce((acc, curr) => acc + curr.growth, 0) / ethnicityData.length;
    const mostDiverse = ethnicityData.reduce((prev, curr) => 
      Object.keys(prev.subgroups).length > Object.keys(curr.subgroups).length ? prev : curr
    );
    return {
      total,
      avgGrowth: avgGrowth.toFixed(1),
      mostDiverse: `${mostDiverse.name} (${Object.keys(mostDiverse.subgroups).length} subgroups)`
    };
  };

  const ageStats = calculateAgeStats();
  const ethnicityStats = calculateEthnicityStats();
  const genderTotal = genderData.reduce((acc, curr) => acc + curr.value, 0);
  const disabilityTotal = disabilityData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 mb-8">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center text-[#0066CC] mb-6"
      >
        Anonymous Demographic Insights
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-[#0066CC]">Combined Demographics Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <svg ref={donutChartRef} width="400" height="400" />
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0066CC]">Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ageData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Total"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Full-time"
                      dataKey="fulltime"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Part-time"
                      dataKey="parttime"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0066CC]">Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genderData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.gender[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0066CC]">Disability Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={disabilityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {disabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.disability[index]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0066CC]">Ethnicity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <XAxis 
                      dataKey="value" 
                      name="Percentage" 
                      unit="%" 
                      label={{ value: 'Distribution (%)', position: 'bottom' }}
                    />
                    <YAxis 
                      dataKey="growth" 
                      name="Growth" 
                      unit="%" 
                      label={{ value: 'YoY Growth (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis 
                      dataKey="ratio" 
                      range={[100, 800]} 
                      name="Representation"
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border border-gray-200 rounded shadow">
                              <p className="font-bold">{data.name}</p>
                              <p>Distribution: {data.value}%</p>
                              <p>Growth: {data.growth}%</p>
                              <div className="text-sm text-gray-600 mt-1">
                                {Object.entries(data.subgroups).map(([key, value]) => (
                                  <p key={key}>{key}: {value}%</p>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Scatter
                      name="Ethnicity Distribution"
                      data={ethnicityData}
                      fill="#8884d8"
                    >
                      {ethnicityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.ethnicity[index]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="text-lg font-medium text-[#0066CC]">Aggregate Statistics Summary</span>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-[#0066CC]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#0066CC]" />
            )}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-[#0066CC] mb-2">Age Distribution</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Average age group representation: {ageStats.average}%</li>
                  <li>• Largest age group: {ageStats.largestGroup}</li>
                  <li>• Total sample size: {ageStats.total}%</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-[#0066CC] mb-2">Gender Distribution</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Total respondents: {genderTotal}%</li>
                  <li>• Male to Female ratio: {(genderData[0].value / genderData[1].value).toFixed(2)}</li>
                  <li>• Non-binary representation: {genderData[2].value}%</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-[#0066CC] mb-2">Ethnicity Insights</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Average YoY growth: {ethnicityStats.avgGrowth}%</li>
                  <li>• Most diverse category: {ethnicityStats.mostDiverse}</li>
                  <li>• Total representation: {ethnicityStats.total}%</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-[#0066CC] mb-2">Disability Overview</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Total responses: {disabilityTotal}%</li>
                  <li>• Disability rate: {disabilityData[0].value}%</li>
                  <li>• Response rate: {(100 - disabilityData[2].value)}%</li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
    </div>
  );
};

export default DemographicInsights;
