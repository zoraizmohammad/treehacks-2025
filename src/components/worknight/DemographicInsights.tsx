
import { BarChart, Bar, Cell, PieChart, Pie, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DemographicInsights = () => {
  const donutChartRef = useRef<SVGSVGElement>(null);

  // Mock data for regular pie charts
  const ageData = [
    { name: '18-24', value: 30 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45-54', value: 7 },
    { name: '55+', value: 3 },
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
    { name: 'Asian', value: 25 },
    { name: 'Black', value: 20 },
    { name: 'Hispanic', value: 15 },
    { name: 'White', value: 35 },
    { name: 'Decline', value: 5 },
  ];

  // Multi-level donut chart data
  const multiLevelData = {
    age: [
      { name: '18-24', value: 30 },
      { name: '25-34', value: 45 },
      { name: '35-44', value: 15 },
      { name: '45-54', value: 7 },
      { name: '55+', value: 3 },
    ],
    gender: [
      { name: 'Male', value: 55 },
      { name: 'Female', value: 40 },
      { name: 'Non-binary', value: 3 },
      { name: 'Decline', value: 2 },
    ],
    ethnicity: [
      { name: 'Asian', value: 25 },
      { name: 'Black', value: 20 },
      { name: 'Hispanic', value: 15 },
      { name: 'White', value: 35 },
      { name: 'Decline', value: 5 },
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
    svg.selectAll("*").remove(); // Clear existing content

    const width = 400;
    const height = 400;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create scales for each ring
    const createArc = (innerRadiusRatio: number, outerRadiusRatio: number) =>
      d3.arc()
        .innerRadius(radius * innerRadiusRatio)
        .outerRadius(radius * outerRadiusRatio);

    const pie = d3.pie<any>().value((d: any) => d.value);

    // Create the three rings
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

      // Add tooltips
      path
        .append('title')
        .text(d => `${d.data.name}: ${d.data.value}%`);
    });

    // Add legend
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

  return (
    <div className="space-y-6 mb-8">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center text-[#0066CC] mb-6"
      >
        Anonymous Demographic Insights
      </motion.h2>

      {/* Multi-Level Donut Chart */}
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
        {/* Age Distribution - Polar Area Chart */}
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
                      name="Age Groups"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender Distribution - Bar Chart */}
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

        {/* Disability Overview */}
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

        {/* Ethnicity - Bubble Chart */}
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
                    <XAxis dataKey="value" name="Percentage" unit="%" />
                    <YAxis dataKey="ratio" name="Ratio" />
                    <ZAxis range={[100, 800]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
    </div>
  );
};

export default DemographicInsights;
