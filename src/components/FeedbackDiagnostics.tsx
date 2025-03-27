
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend } from 'recharts';

interface FeedbackData {
  industry: string;
  organization: string;
  overall: number;
  [key: string]: string | number;
}

interface FeedbackDiagnosticsProps {
  data: FeedbackData[];
  industries: string[];
  organizations: { [key: string]: string[] };
  dimensions: string[];
}

// Custom function to determine color based on value
const getColorForValue = (value: number) => {
  if (value >= 85) return '#10b981'; // green
  if (value >= 75) return '#22c55e'; // green-lighter
  if (value >= 65) return '#facc15'; // yellow
  if (value >= 55) return '#f59e0b'; // amber
  return '#ef4444'; // red
};

const FeedbackDiagnostics: React.FC<FeedbackDiagnosticsProps> = ({ data, industries, organizations, dimensions }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industries[0]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Set the first organization when industry changes
  useEffect(() => {
    if (organizations[selectedIndustry] && organizations[selectedIndustry].length > 0) {
      setSelectedOrg(organizations[selectedIndustry][0]);
    }
  }, [selectedIndustry, organizations]);
  
  // Update chart data when selection changes
  useEffect(() => {
    if (!selectedOrg) return;
    
    // Find data for selected organization
    const orgData = data.find(item => 
      item.industry === selectedIndustry && 
      item.organization === selectedOrg
    );
    
    if (orgData) {
      // Format and sort dimensions by value
      const sortedDimensions = [...dimensions].sort((a, b) => 
        (orgData[b] as number) - (orgData[a] as number)
      );
      
      const formattedData = sortedDimensions.map(dim => ({
        dimension: dim,
        value: orgData[dim] as number,
        color: getColorForValue(orgData[dim] as number)
      }));
      
      setChartData(formattedData);
    }
  }, [selectedIndustry, selectedOrg, data, dimensions]);
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BarChart2 size={20} className="text-primary" />
            Direct Feedback Diagnostics
          </CardTitle>
          <CardDescription>
            Customer experience element scores
          </CardDescription>
        </div>
        <div className="flex mt-2 gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={!selectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {selectedIndustry && organizations[selectedIndustry]?.map((org) => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[310px] mt-2 animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="horizontal"
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dimension" tick={{ fontSize: 12 }} interval={0} />
              <YAxis 
                domain={[50, 100]}
                tickCount={6}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(1), 'Score']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(v: number) => v.toFixed(1)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center items-center mt-2 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Excellent (85+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-xs">Good (65-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Needs Improvement (<65)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDiagnostics;
