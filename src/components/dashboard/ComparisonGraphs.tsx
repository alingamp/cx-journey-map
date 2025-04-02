import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

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
  const generateTimeSeriesData = () => {
    const quarters = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'];
    
    return quarters.map(quarter => {
      const quarterData: { [key: string]: any } = { quarter };
      
      data.forEach(company => {
        const baseCxIndex = typeof company.cxIndex === 'number' 
          ? company.cxIndex 
          : 70;
          
        const variationMultiplier = quarter === 'Q1 2024' 
          ? 1 
          : 0.95 + (Math.random() * 0.1);
          
        const trendFactor = company.trend === 'up' 
          ? 1 + (quarters.indexOf(quarter) * 0.01) 
          : company.trend === 'down' 
            ? 1 - (quarters.indexOf(quarter) * 0.01) 
            : 1;
            
        quarterData[company.organization] = parseFloat(
          (baseCxIndex * variationMultiplier * trendFactor).toFixed(1)
        );
      });
      
      return quarterData;
    });
  };

  const timeSeriesData = generateTimeSeriesData();

  const companies = data.map(item => item.organization);
  
  const getLineColor = (index: number) => {
    const colors = [
      '#4f46e5',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#06b6d4',
      '#ec4899',
      '#16a34a',
      '#64748b',
      '#9333ea',
      '#f97316',
      '#0ea5e9',
      '#14b8a6',
      '#6366f1',
      '#84cc16',
      '#a855f7',
      '#d946ef'
    ];
    return colors[index % colors.length];
  };

  const customTooltipFormatter = (value: number, name: string) => {
    return [`${value.toFixed(1)}`, name];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p 
            key={`item-${index}`} 
            style={{ color: entry.color }}
            className="flex items-center justify-between gap-2"
          >
            <span>{entry.name}:</span>
            <span className="font-semibold">{entry.value.toFixed(1)}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            CX Index Trends Over Time
          </CardTitle>
          <CardDescription>
            Quarter-by-quarter performance trends for telecom companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="quarter" 
                  angle={0} 
                  textAnchor="middle" 
                  height={50} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis domain={[60, 90]} tickCount={7} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: 20 }}
                />
                
                {companies.map((company, index) => (
                  <Line
                    key={company}
                    type="monotone"
                    dataKey={company}
                    name={company}
                    stroke={getLineColor(index)}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonGraphs;
