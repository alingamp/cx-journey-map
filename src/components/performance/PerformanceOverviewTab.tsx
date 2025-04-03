
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SpiderDimensionsChart from '@/components/SpiderDimensionsChart';

interface PerformanceOverviewTabProps {
  performanceTrendData: any[];
  cxDimensions: any[];
}

const PerformanceOverviewTab: React.FC<PerformanceOverviewTabProps> = ({ 
  performanceTrendData,
  cxDimensions
}) => {
  // Data for the spider chart
  const spiderData = [
    { dimension: "Efficiency", ATT: 7.8, Verizon: 7.1, TMobile: 6.9, fullName: "The fastest and easiest way to complete my task" },
    { dimension: "Fun", ATT: 6.7, Verizon: 6.3, TMobile: 7.2, fullName: "A fun or enjoyable experience" },
    { dimension: "Control", ATT: 7.5, Verizon: 7.7, TMobile: 6.9, fullName: "Control over my situation and choices" },
    { dimension: "Clarity", ATT: 8.2, Verizon: 7.6, TMobile: 7.0, fullName: "Clear and understandable information or assistance" },
    { dimension: "Learning", ATT: 7.1, Verizon: 6.8, TMobile: 6.5, fullName: "Gathering additional information or learning something new" },
    { dimension: "Autonomy", ATT: 6.9, Verizon: 7.2, TMobile: 6.7, fullName: "Getting exactly what I want" },
  ];

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

      {/* Spider chart for customer experience dimensions */}
      <SpiderDimensionsChart data={spiderData} />
    </div>
  );
};

export default PerformanceOverviewTab;
