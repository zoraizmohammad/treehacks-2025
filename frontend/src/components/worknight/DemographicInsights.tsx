import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const processRawData = (rawData: number[]) => {
  const total = rawData.slice(0, 6).reduce((acc, val) => acc + val, 0);
  const toPercent = (val: number) => (val / total) * 100;

  const ageLabels = ['18-24', '25-34', '35-44', '45-54', '55+', 'Decline'];
  const disabilityLabels = ['Yes', 'No', 'Decline'];
  const genderLabels = ['Male', 'Female', 'Non-binary', 'Decline'];
  const raceLabels = ['Asian', 'Black', 'Hispanic', 'White', 'Decline'];

  const ageData = rawData.slice(0, 6).map((count, i) => ({
    name: ageLabels[i],
    value: toPercent(count),
    raw: count,
  }));
  const disabilityData = rawData.slice(6, 9).map((count, i) => ({
    name: disabilityLabels[i],
    value: toPercent(count),
    raw: count,
  }));
  const genderData = rawData.slice(9, 13).map((count, i) => ({
    name: genderLabels[i],
    value: toPercent(count),
    raw: count,
  }));
  const raceData = rawData.slice(13, 18).map((count, i) => ({
    name: raceLabels[i],
    value: toPercent(count),
    raw: count,
  }));

  return { ageData, disabilityData, genderData, raceData };
};

const COLORS = {
  age: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'],
  disability: ['#47B39C', '#EC6B56', '#FFC154'],
  gender: ['#6C5B7B', '#C06C84', '#F67280', '#F8B195'],
  race: ['#355C7D', '#6C5B7B', '#C06C84', '#F67280', '#F8B195'],
};

interface DemographicInsightsProps {
  data: number[];
}

const DemographicInsights = ({ data }: DemographicInsightsProps) => {
  if (data.length < 18) return <div className="p-4">Incomplete data.</div>;

  const { ageData, disabilityData, genderData, raceData } = processRawData(data);

  // Conditionally show label only if `raw` > 0
  const labelFn = ({ name, value, payload }: any) => {
    if (payload.raw === 0) return '';
    return `${name}: ${payload.raw} (${value.toFixed(1)}%)`;
  };

  // Tooltip can still show zero slices if needed
  const tooltipFormatter = (pctValue: number, _name: string, props: any) => {
    if (props.payload.raw === 0) return '0 (0%)';
    return `${props.payload.raw} (${pctValue.toFixed(1)}%)`;
  };

  return (
    <div className="space-y-6 mb-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center text-[#0066CC] mb-6"
      >
        Demographic Insights
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0066CC]">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={false}
                  label={labelFn}
                >
                  {ageData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS.age[idx % COLORS.age.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0066CC]">Disability</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={disabilityData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={false}
                  label={labelFn}
                >
                  {disabilityData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS.disability[idx % COLORS.disability.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0066CC]">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={false}
                  label={labelFn}
                >
                  {genderData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS.gender[idx % COLORS.gender.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Race/Ethnicity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0066CC]">Race/Ethnicity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={raceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={false}
                  label={labelFn}
                >
                  {raceData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS.race[idx % COLORS.race.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemographicInsights;
