
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart as LineChartIcon, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CompetitiveLandscape as CompetitiveLandscapeType } from '@/services/mockData';

interface CompetitiveLandscapeProps {
  data: CompetitiveLandscapeType[];
  industries: string[];
}

const CompetitiveLandscape: React.FC<CompetitiveLandscapeProps> = ({ data, industries }) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([industries[0]]);
  
  const handleIndustryChange = (value: string) => {
    if (value === 'All Industries') {
      setSelectedIndustries(industries);
    } else if (value === 'Clear All') {
      setSelectedIndustries([]);
    } else {
      // Toggle the selected industry
      if (selectedIndustries.includes(value)) {
        setSelectedIndustries(selectedIndustries.filter(i => i !== value));
      } else {
        setSelectedIndustries([...selectedIndustries, value]);
      }
    }
  };
  
  // Filter data for selected industries and only use entries with year data
  const filteredData = data.filter(item => 
    selectedIndustries.includes(item.industry) && 
    item.year !== undefined && 
    item.experientialFocus !== undefined
  );
  
  // Process data for the chart, grouping by year
  const chartData = filteredData.reduce((result: any[], item) => {
    if (!item.year) return result;
    
    // Find if we already have this year in the result
    const yearEntry = result.find(entry => entry.year === item.year);
    
    if (yearEntry) {
      // Add this industry's experiential focus to the existing entry
      yearEntry[item.industry] = item.experientialFocus;
    } else {
      // Create a new entry for this year
      const newEntry: any = {
        year: item.year,
        [item.industry]: item.experientialFocus
      };
      result.push(newEntry);
    }
    
    return result;
  }, []);
  
  // Sort by year
  chartData.sort((a, b) => a.year - b.year);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-xs">
          <p className="font-medium mb-1">Year: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span>{entry.name}: </span>
              <span className="font-medium">{entry.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Generate colors for each industry
  const industryColors: { [key: string]: string } = {
    'Airline': '#4f46e5',
    'Hotel': '#06b6d4',
    'Retail Banking': '#10b981',
    'Insurance': '#f59e0b',
    'Healthcare': '#8b5cf6',
    'Telecom': '#ec4899',
    'Retail/E-commerce': '#f43f5e',
    'Retail': '#f43f5e',
    'Banking': '#10b981',
    'Travel': '#06b6d4',
    'Utilities': '#f59e0b',
    'Technology': '#4f46e5'
  };
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <LineChartIcon size={20} className="text-primary" />
            Competitive Landscape Evolution
          </CardTitle>
          <CardDescription>
            Tracking industry shifts toward experiential competition
          </CardDescription>
        </div>
        <div className="flex mt-2 gap-2">
          <Select onValueChange={handleIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select/Deselect Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Industries">Select All Industries</SelectItem>
              <SelectItem value="Clear All">Clear All</SelectItem>
              <div className="h-px bg-gray-100 my-1"></div>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {selectedIndustries.includes(industry) && (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: industryColors[industry] }}></span>
                    )}
                    {industry}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[320px] animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                label={{ value: 'Year', position: 'insideBottom', offset: -20, fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Experiential Focus', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12 }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              
              {selectedIndustries.map(industry => (
                <Line
                  key={industry}
                  type="monotone"
                  dataKey={industry}
                  name={industry}
                  stroke={industryColors[industry]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Analysis box */}
        <div className="mt-2 p-3 bg-gray-50 rounded-lg animate-slide-up">
          <h4 className="font-medium text-sm mb-1">Trend Analysis:</h4>
          <ul className="text-xs space-y-1 text-gray-600">
            {selectedIndustries.length > 0 ? (
              <>
                {selectedIndustries.includes('Hotel') && (
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: industryColors['Hotel'] }}></span>
                    <span>Hotel industry shows strongest shift toward experience-based competition</span>
                  </li>
                )}
                {selectedIndustries.includes('Retail') && (
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: industryColors['Retail'] }}></span>
                    <span>Retail rapidly increasing experiential focus since 2020</span>
                  </li>
                )}
                {selectedIndustries.includes('Telecom') && (
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: industryColors['Telecom'] }}></span>
                    <span>Telecom remains more commodity-focused despite slight experiential increases</span>
                  </li>
                )}
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2 bg-gray-400"></span>
                  <span>Overall industry trend shows 5-10% annual increase in experience focus</span>
                </li>
              </>
            ) : (
              <li>Select industries to view trend analysis</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitiveLandscape;
