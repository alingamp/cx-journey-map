import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart as LineChartIcon, TrendingUp, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { getAllData } from '@/services/mockData';
import { generateCompetitiveLandscape } from '@/services/mockData';

const TrendAnalysis = () => {
  const data = getAllData();
  const [selectedIndustry, setSelectedIndustry] = useState(data.industries[0]);
  
  const competitiveLandscape = generateCompetitiveLandscape(selectedIndustry);
  
  const industryTrends = competitiveLandscape
    .filter(item => item.year && typeof item.year === 'number')
    .sort((a, b) => (a.year || 0) - (b.year || 0));

  const cxIndexTrend = data.industries.map(industry => {
    const industryData = data.cxIndexData.filter(item => item.industry === industry);
    const average = parseFloat((industryData.reduce((acc, item) => acc + item.cxIndex, 0) / industryData.length).toFixed(1));
    const lastYearAverage = parseFloat((industryData.reduce((acc, item) => acc + item.lastYearIndex, 0) / industryData.length).toFixed(1));
    const change = parseFloat((average - lastYearAverage).toFixed(1));
    const percentChange = parseFloat(((change / lastYearAverage) * 100).toFixed(1));
    
    return {
      industry,
      currentYear: average,
      lastYear: lastYearAverage,
      change,
      percentChange,
      isImproving: change > 0
    };
  });
  
  const selectedIndustryTrend = cxIndexTrend.find(item => item.industry === selectedIndustry);
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <LineChartIcon className="h-8 w-8 text-primary" />
              Trend Analysis
            </h1>
            <p className="text-muted-foreground">
              Monitor CX trends and competitive landscape evolution
            </p>
          </div>
          
          <div className="w-full lg:w-72">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {data.industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current CX Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {selectedIndustryTrend?.currentYear}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {selectedIndustryTrend?.lastYear}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center">
                {selectedIndustryTrend?.change > 0 ? (
                  <ArrowUp className="mr-1 text-green-500" />
                ) : (
                  <ArrowDown className="mr-1 text-red-500" />
                )}
                {selectedIndustryTrend?.change}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">% Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center">
                {selectedIndustryTrend?.percentChange > 0 ? (
                  <ArrowUp className="mr-1 text-green-500" />
                ) : (
                  <ArrowDown className="mr-1 text-red-500" />
                )}
                {selectedIndustryTrend?.percentChange}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Competitive Intensity Trend</CardTitle>
              <CardDescription>
                Changes in competitive intensity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={industryTrends}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} tickCount={6} />
                    <Tooltip
                      formatter={(value: number) => [`${value}`, 'Intensity']}
                      labelFormatter={(value) => `Year: ${value}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      name="Competitive Intensity"
                      dataKey="competitiveIntensity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Focus Evolution</CardTitle>
              <CardDescription>
                Shift between experiential and commodity competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={industryTrends}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} tickCount={6} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '']}
                      labelFormatter={(value) => `Year: ${value}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      name="Experiential Focus"
                      dataKey="experientialFocus"
                      stroke="#10b981"
                      fill="#10b98133"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      name="Commodity Focus"
                      dataKey="commodityFocus"
                      stroke="#f59e0b"
                      fill="#f59e0b33"
                      stackId="1"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>CX Trends Across Industries</CardTitle>
            <CardDescription>
              Year-over-year change in Customer Experience Index
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChartWithLabels data={cxIndexTrend} />
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const BarChartWithLabels = ({ data }: { data: any[] }) => {
  const sortedData = [...data].sort((a, b) => b.change - a.change);
  
  return (
    <div className="space-y-4">
      {sortedData.map((item, index) => (
        <div key={item.industry} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.industry}</span>
            <span className="font-medium flex items-center">
              {item.isImproving ? (
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
              )}
              {item.change}
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden relative">
            <div 
              className={`h-full rounded-full absolute top-0 ${item.isImproving ? 'bg-green-500 left-1/2' : 'bg-red-500 right-1/2'}`}
              style={{ 
                width: `${Math.abs(item.change) * 5}%`,
                maxWidth: '50%'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendAnalysis;
