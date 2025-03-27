
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface IndustryFocusData {
  year: number;
  experientialFocus: number;
  commodityFocus: number;
  [key: string]: number | string;
}

interface IndustryFocusChartProps {
  data: IndustryFocusData[];
}

const IndustryFocusChart: React.FC<IndustryFocusChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
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
          formatter={(value: number) => [`${value}%`, '']}
          labelFormatter={(value) => `Year: ${value}`}
        />
        <Legend verticalAlign="top" height={36} />
        <Area
          type="monotone"
          name="Experiential Focus"
          dataKey="experientialFocus"
          stroke="#10b981"
          fill="#10b98133"
          stackId="1"
        />
        <Area
          type="monotone"
          name="Commodity Focus"
          dataKey="commodityFocus"
          stroke="#f59e0b"
          fill="#f59e0b33"
          stackId="1"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IndustryFocusChart;
