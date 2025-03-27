
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
        color: getColorForValue(orgData[dim] as number),
        // Add a shortened version of the dimension name for mobile
        shortDimension: dim.substring(0, 4)
      }));
      
      setChartData(formattedData);
    }
  }, [selectedIndustry, selectedOrg, data, dimensions]);

  // Determine chart height based on screen size
  const chartHeight = isMobile ? 240 : 310;
  
  // Custom tooltip for better readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border text-xs">
          <p className="font-medium mb-1">{data.dimension}</p>
          <div className="flex items-center gap-2">
            <span>Score: </span>
            <span className="font-bold" style={{ color: data.color }}>
              {data.value.toFixed(1)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };
  
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
        <div className={`flex mt-2 ${isMobile ? 'flex-col space-y-2' : 'flex-row gap-2'}`}>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className={isMobile ? "w-full" : "flex-1"}>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={!selectedIndustry}>
            <SelectTrigger className={isMobile ? "w-full" : "flex-1"}>
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
        <div className={`h-[${chartHeight}px] mt-2 animate-fade-in`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="horizontal"
              data={chartData}
              margin={isMobile ? 
                { top: 5, right: 10, left: 0, bottom: 30 } : 
                { top: 5, right: 30, left: 0, bottom: 5 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={isMobile ? "shortDimension" : "dimension"} 
                tick={{ fontSize: isMobile ? 10 : 12 }} 
                interval={0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis 
                domain={[50, 100]}
                tickCount={isMobile ? 5 : 6}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 25 : 35}
              />
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  formatter={(v: number) => v.toFixed(1)} 
                  fontSize={isMobile ? 10 : 12}
                  offset={isMobile ? 5 : 10}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend with responsive layout */}
        <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'justify-center items-center'} mt-2 ${isMobile ? 'gap-1' : 'gap-6'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>Excellent (85+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>Good (65-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>Needs Improvement (&lt;65)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDiagnostics;
