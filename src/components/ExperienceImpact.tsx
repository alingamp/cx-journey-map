
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart4, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

interface ImpactData {
  industry: string;
  organization: string;
  dimension: string;
  incomingExpectation: number;
  outgoingExpectation: number;
  gap: number;
}

interface ExperienceImpactProps {
  data: ImpactData[];
  industries: string[];
  organizations: { [key: string]: string[] };
  dimensions: string[];
}

const ExperienceImpact: React.FC<ExperienceImpactProps> = ({ data, industries, organizations, dimensions }) => {
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
    
    // Filter data for selected organization
    const orgData = data.filter(item => 
      item.industry === selectedIndustry && 
      item.organization === selectedOrg
    );
    
    if (orgData && orgData.length > 0) {
      // Sort by gap size, descending
      const sortedData = [...orgData].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
      
      // Format data for chart
      const formattedData = sortedData.map(item => ({
        dimension: item.dimension,
        incoming: item.incomingExpectation,
        outgoing: item.outgoingExpectation,
        gap: item.gap,
        positive: item.gap > 0
      }));
      
      setChartData(formattedData);
    }
  }, [selectedIndustry, selectedOrg, data]);
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Experience Impact Scores
          </CardTitle>
          <CardDescription>
            Comparison of customer expectations before and after experience
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
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[40, 100]} tickCount={7} />
              <YAxis 
                type="category" 
                dataKey="dimension" 
                tick={{ fontSize: 12 }}
                width={130}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const formatName = name === 'incoming' ? 'Incoming Expectation' : 
                                      name === 'outgoing' ? 'Outgoing Experience' : 'Gap';
                  return [value.toFixed(1), formatName];
                }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'incoming' ? 'Incoming Expectation' : 'Outgoing Experience';
                }}
              />
              <Bar 
                dataKey="incoming" 
                fill="#94a3b8" 
                name="incoming"
                radius={[0, 0, 0, 0]}
                barSize={10}
              />
              <Bar 
                dataKey="outgoing" 
                fill="#4f46e5" 
                name="outgoing"
                radius={[0, 0, 0, 0]}
                barSize={10}
              />
              <ReferenceLine x={75} stroke="#94a3b8" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary */}
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Key Insights:</h4>
          <ul className="text-xs space-y-1 text-gray-600">
            {chartData.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${item.gap > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>
                  <strong>{item.dimension}:</strong> {item.gap > 0 
                    ? `Exceeds expectations by ${item.gap.toFixed(1)} points` 
                    : `Falls short by ${Math.abs(item.gap).toFixed(1)} points`}
                </span>
              </li>
            ))}
            {chartData.length > 0 && (
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
                <span>
                  <strong>Overall:</strong> {chartData.filter(i => i.gap > 0).length} dimensions exceed expectations
                </span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceImpact;
