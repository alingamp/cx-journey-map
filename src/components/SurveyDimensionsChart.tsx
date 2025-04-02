
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SurveyDimension {
  dimension: string;
  score: number;
}

interface SurveyDimensionsChartProps {
  data: SurveyDimension[];
}

const getColorForScore = (score: number) => {
  if (score >= 8.5) return '#10b981'; // green
  if (score >= 7) return '#22c55e'; // green-lighter
  if (score >= 6) return '#facc15'; // yellow
  if (score >= 5) return '#f59e0b'; // amber
  return '#ef4444'; // red
};

const SurveyDimensionsChart: React.FC<SurveyDimensionsChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Experience Dimensions</CardTitle>
        <CardDescription>How customers feel across key experience dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis dataKey="dimension" type="category" width={110} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}/10`, 'Score']}
                labelFormatter={(value) => `${value} Dimension`}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorForScore(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyDimensionsChart;
