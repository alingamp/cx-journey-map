
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>CX Factor Strength</CardTitle>
            <CardDescription>AT&T performance by CX dimension</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={cxDimensions.map((dim: string) => ({
                    dimension: dim,
                    score: 40 + Math.random() * 45
                  }))}
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="dimension" type="category" width={70} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}`, 'Score']}
                    labelFormatter={(value) => `${value} Performance`}
                  />
                  <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Competitive Comparison</CardTitle>
            <CardDescription>AT&T vs. top telecom competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Overall CX', att: 76.3, verizon: 79.1, tmobile: 77.5 },
                    { name: 'Network Reliability', att: 82.1, verizon: 85.3, tmobile: 78.9 },
                    { name: 'Customer Service', att: 71.5, verizon: 69.8, tmobile: 74.2 },
                    { name: 'Value', att: 68.7, verizon: 65.3, tmobile: 75.6 },
                    { name: 'Innovation', att: 73.9, verizon: 77.2, tmobile: 78.8 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="att" name="AT&T" fill="#4f46e5" />
                  <Bar dataKey="verizon" name="Verizon" fill="#10b981" />
                  <Bar dataKey="tmobile" name="T-Mobile" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceOverviewTab;
