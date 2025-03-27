
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChartIcon, BarChart2 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList } from 'recharts';

interface IndustryLoadingData {
  industry: string;
  [key: string]: string | number;
}

interface IndustryLoadingsProps {
  data: IndustryLoadingData[];
  industries: string[];
  dimensions: string[];
}

const CustomizedLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text x={x + width - 5} y={y + 15} fill="#000" textAnchor="end" fontSize={10}>
      {value}
    </text>
  );
};

const IndustryLoadings: React.FC<IndustryLoadingsProps> = ({ data, industries, dimensions }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industries[0]);
  const [viewType, setViewType] = useState<'radar' | 'bar'>('radar');
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Find data for selected industry
    const industryData = data.find(item => item.industry === selectedIndustry);
    
    if (industryData) {
      if (viewType === 'radar') {
        // Format data for radar chart
        setChartData(dimensions.map(dim => ({
          dimension: dim,
          value: industryData[dim] as number,
          fullMark: 1
        })));
      } else {
        // Format data for bar chart
        const sortedDimensions = [...dimensions].sort((a, b) => 
          (industryData[b] as number) - (industryData[a] as number)
        );
        
        setChartData(sortedDimensions.map(dim => ({
          dimension: dim,
          value: Number((industryData[dim] as number).toFixed(2))
        })));
      }
    }
  }, [selectedIndustry, viewType, data, dimensions]);
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart2 size={20} className="text-primary" />
              Industry Factor Loadings
            </CardTitle>
            <CardDescription>
              Weighted impact of customer experience factors
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewType('radar')}
              className={`p-2 rounded-lg transition-colors ${viewType === 'radar' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
            >
              <LineChartIcon size={18} />
            </button>
            <button 
              onClick={() => setViewType('bar')}
              className={`p-2 rounded-lg transition-colors ${viewType === 'bar' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
            >
              <BarChart2 size={18} />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="w-full">
          <TabsList className="grid grid-cols-7 mb-2">
            {industries.map((industry) => (
              <TabsTrigger key={industry} value={industry} className="text-xs py-1">
                {industry.split('/')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {industries.map((industry) => (
            <TabsContent key={industry} value={industry} className="h-[300px] mt-0">
              <div className="h-full w-full animate-fade-in">
                {viewType === 'radar' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                      <Radar
                        name={industry}
                        dataKey="value"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.2}
                      />
                      <Tooltip 
                        formatter={(value: number) => [Number(value).toFixed(2), 'Loading']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 1]} tickCount={6} />
                      <YAxis 
                        type="category" 
                        dataKey="dimension" 
                        tick={{ fontSize: 12 }}
                        width={120}
                      />
                      <Tooltip 
                        formatter={(value: number) => [Number(value).toFixed(2), 'Loading']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="value" position="right" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IndustryLoadings;
