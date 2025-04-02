
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceOverviewTabProps {
  performanceTrendData: any[];
  cxDimensions: any[];
}

const PerformanceOverviewTab: React.FC<PerformanceOverviewTabProps> = ({ 
  performanceTrendData,
  cxDimensions
}) => {
  return (
    <div className="space-y-5 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Key metrics over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cxIndex" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="CX Index" />
                <Line type="monotone" dataKey="directFeedback" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Direct Feedback" />
                <Line type="monotone" dataKey="passiveMetrics" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Passive Metrics" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOverviewTab;
