
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
  // Generate time-series data for the last 5 quarters
  const generateTimeSeriesData = () => {
    const quarters = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'];
    
    // Create a dataset for each quarter with all companies
    return quarters.map(quarter => {
      const quarterData: { [key: string]: any } = { quarter };
      
      // For each company, generate a slightly different CX Index score for each quarter
      // to simulate trends over time
      data.forEach(company => {
        // Base the score on the current CX Index, but vary it slightly for each quarter
        // to create a realistic trend
        const baseCxIndex = typeof company.cxIndex === 'number' 
          ? company.cxIndex 
          : 70; // Default if not a number
          
        // Generate a random multiplier between 0.95 and 1.05 to create variation
        const variationMultiplier = quarter === 'Q1 2024' 
          ? 1 // Current quarter matches exactly
          : 0.95 + (Math.random() * 0.1); // Previous quarters vary slightly
          
        // Apply the company's trend direction over time
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

  // Create a list of companies for the legend
  const companies = data.map(item => item.organization);
  
  // Generate colors for each company (using a simple pattern)
  const getLineColor = (index: number) => {
    const colors = [
      '#4f46e5', // indigo
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#06b6d4', // cyan
      '#ec4899', // pink
      '#16a34a', // green
      '#64748b', // slate
      '#9333ea', // purple
      '#f97316', // orange
      '#0ea5e9', // sky
      '#14b8a6', // teal
      '#6366f1', // indigo
      '#84cc16', // lime
      '#a855f7', // purple
      '#d946ef'  // fuchsia
    ];
    return colors[index % colors.length];
  };

  // Custom tooltip formatter to show company name instead of "CX Index"
  const customTooltipFormatter = (value: number, name: string) => {
    return [`${value.toFixed(1)}`, name];
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
                <Tooltip
                  formatter={customTooltipFormatter}
                  labelFormatter={(label) => `${label}`}
                />
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
