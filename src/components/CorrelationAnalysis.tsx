import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend, Label } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface CorrelationData {
  industry: string;
  organization: string;
  cxIndex: number;
  financialMetric: string;
  value: number;
  potential: number;
}

interface CorrelationAnalysisProps {
  data: CorrelationData[];
  industries: string[];
  financialMetrics: string[];
  organizations?: { [key: string]: string[] };
  metrics?: string[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border text-xs">
        <p className="font-medium">{payload[0].payload.organization}</p>
        <p className="text-gray-600">{payload[0].payload.industry}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
          <p>CX Index:</p>
          <p className="font-medium">{payload[0].payload.cxIndex}</p>
          <p>{payload[0].payload.financialMetric}:</p>
          <p className="font-medium">{payload[0].payload.value}%</p>
        </div>
      </div>
    );
  }
  return null;
};

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ data, industries, financialMetrics, organizations, metrics }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedMetric, setSelectedMetric] = useState<string>(financialMetrics[0]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [correlationStrength, setCorrelationStrength] = useState<string>('');
  
  // Update chart data when selection changes
  useEffect(() => {
    if (!selectedMetric) return;
    
    // Filter data for selected metric and industry
    let filteredData = data.filter(item => item.financialMetric === selectedMetric);
    
    if (selectedIndustry !== 'All Industries') {
      filteredData = filteredData.filter(item => item.industry === selectedIndustry);
    }
    
    setChartData(filteredData);
    
    // Calculate correlation coefficient
    if (filteredData.length > 0) {
      const xValues = filteredData.map(item => item.cxIndex);
      const yValues = filteredData.map(item => item.value);
      
      const correlation = calculateCorrelation(xValues, yValues);
      
      if (correlation >= 0.7) {
        setCorrelationStrength('Strong positive correlation');
      } else if (correlation >= 0.3) {
        setCorrelationStrength('Moderate positive correlation');
      } else if (correlation >= -0.3) {
        setCorrelationStrength('Weak or no correlation');
      } else if (correlation >= -0.7) {
        setCorrelationStrength('Moderate negative correlation');
      } else {
        setCorrelationStrength('Strong negative correlation');
      }
    }
  }, [selectedIndustry, selectedMetric, data]);
  
  // Calculate correlation coefficient
  const calculateCorrelation = (xValues: number[], yValues: number[]): number => {
    const n = xValues.length;
    if (n === 0) return 0;
    
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    if (xDenominator === 0 || yDenominator === 0) return 0;
    
    return numerator / Math.sqrt(xDenominator * yDenominator);
  };
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Correlation Analysis
          </CardTitle>
          <CardDescription>
            Relationship between CX scores and financial metrics
          </CardDescription>
        </div>
        <div className="flex mt-2 gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Industries">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Financial Metric" />
            </SelectTrigger>
            <SelectContent>
              {financialMetrics.map((metric) => (
                <SelectItem key={metric} value={metric}>{metric}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[280px] mt-2 animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="cxIndex" 
                name="CX Index" 
                domain={[60, 100]}
                tick={{ fontSize: 12 }}
              >
                <Label value="CX Index Score" offset={-10} position="insideBottom" fontSize={12} />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="value" 
                name={selectedMetric} 
                tick={{ fontSize: 12 }}
              >
                <Label value={selectedMetric} angle={-90} position="insideLeft" offset={-5} fontSize={12} />
              </YAxis>
              <ZAxis range={[50, 300]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter 
                name={selectedIndustry === 'All Industries' ? 'All Industries' : selectedIndustry} 
                data={chartData} 
                fill="#4f46e5" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Analysis box */}
        <div className="mt-2 p-3 bg-gray-50 rounded-lg animate-slide-up">
          <h4 className="font-medium text-sm mb-1">Analysis:</h4>
          <p className="text-xs text-gray-600 mb-2">{correlationStrength}</p>
          {chartData.length > 0 && (
            <p className="text-xs text-gray-600">
              {selectedMetric === 'Customer Retention' ? 
                `Organizations with higher CX scores generally show better customer retention rates, particularly in the ${chartData[0]?.industry || 'selected'} industry.` :
              selectedMetric === 'Revenue Growth' ?
                `There appears to be a correlation between CX investment and revenue growth, with potential for significant returns.` :
              selectedMetric === 'Customer Acquisition Cost' ?
                `Better customer experience tends to correlate with lower acquisition costs, creating efficiency.` :
                `The data suggests further investment in CX could yield positive returns in ${selectedMetric}.`
              }
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
