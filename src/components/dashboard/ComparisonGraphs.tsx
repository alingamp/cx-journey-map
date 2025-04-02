
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CompanyMetrics {
  organization: string;
  cxIndex: number | string;
  directFeedback: number;
  passiveMetrics: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ComparisonGraphsProps {
  data: CompanyMetrics[];
}

const ComparisonGraphs: React.FC<ComparisonGraphsProps> = ({ data }) => {
  // Transform data for the chart
  const chartData = data.map(item => ({
    name: item.organization,
    'Direct Feedback': item.directFeedback,
    'Passive Metrics': item.passiveMetrics,
    'CX Index': typeof item.cxIndex === 'number' ? item.cxIndex : 0
  }));

  // Sort data by Direct Feedback score
  const sortedData = [...chartData].sort((a, b) => b['Direct Feedback'] - a['Direct Feedback']);

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>
            Direct Feedback vs Passive Metrics across companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(1), ""]}
                  labelFormatter={(label) => `Company: ${label}`}
                />
                <Legend />
                <Bar dataKey="Direct Feedback" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Passive Metrics" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CX Index" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonGraphs;
