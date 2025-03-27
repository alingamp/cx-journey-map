
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface IndustryOverviewProps {
  data: {
    industry: string;
    years: string[];
    datasets: {
      name: string;
      data: number[];
    }[];
  }[];
  selectedIndustry: string;
}

const IndustryOverview: React.FC<IndustryOverviewProps> = ({ data, selectedIndustry }) => {
  const industryData = data?.find(item => item?.industry === selectedIndustry);
  
  if (!industryData || !Array.isArray(industryData.years) || !Array.isArray(industryData.datasets)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Overview</CardTitle>
          <CardDescription>No data available for the selected industry</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const chartData = industryData.years.map((year, index) => {
    const dataPoint: { [key: string]: any } = { name: year };
    
    industryData.datasets.forEach(dataset => {
      dataPoint[dataset.name] = dataset.data[index] || 0;
    });
    
    return dataPoint;
  });

  const colors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#10b981'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {selectedIndustry} Overview
            </CardTitle>
            <CardDescription>
              Historical performance metrics
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {industryData.datasets.map((dataset, i) => (
                <Line
                  key={dataset.name}
                  type="monotone"
                  dataKey={dataset.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryOverview;
