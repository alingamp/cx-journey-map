
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompetitiveIntensityData {
  year: number;
  competitiveIntensity: number;
  [key: string]: number | string;
}

interface CompetitiveIntensityChartProps {
  data: CompetitiveIntensityData[];
}

const CompetitiveIntensityChart: React.FC<CompetitiveIntensityChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={sortedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 25,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="year" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis domain={[0, 100]} tickCount={6} />
        <Tooltip
          formatter={(value: number) => [`${value}`, 'Intensity']}
          labelFormatter={(value) => `Year: ${value}`}
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          name="Competitive Intensity"
          dataKey="competitiveIntensity"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CompetitiveIntensityChart;
