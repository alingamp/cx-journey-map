
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart as PieChartIcon, BarChart2, TrendingUp, Target, Shield } from 'lucide-react';
import CXIndexSummary from '@/components/CXIndexSummary';
import CompetitiveLandscape from '@/components/CompetitiveLandscape';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';
import { getAllData } from '@/services/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const CompetitiveData = () => {
  const data = getAllData();
  const [selectedIndustry, setSelectedIndustry] = useState(data.industries[0]);
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Competitive Data
            </h1>
            <p className="text-muted-foreground">
              Analyze competitive performance and CX impact on business metrics
            </p>
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="summary">CX Index Summary</TabsTrigger>
            <TabsTrigger value="landscape">Competitive Landscape</TabsTrigger>
            <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            <CXIndexSummary 
              data={data.cxIndexData}
              industries={data.industries}
            />
          </TabsContent>
          
          <TabsContent value="landscape" className="mt-4">
            <CompetitiveLandscape 
              data={data.competitiveLandscape}
              industries={data.industries}
            />
          </TabsContent>
          
          <TabsContent value="correlation" className="mt-4">
            <CorrelationAnalysis 
              data={data.correlationData}
              industries={data.industries}
              financialMetrics={data.financialMetrics}
            />
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Competitive Positioning Matrix
                </CardTitle>
                <CardDescription>
                  Comparing CX performance vs market share
                </CardDescription>
              </div>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {data.industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-80">
              <PositioningMatrix data={data} selectedIndustry={selectedIndustry} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis by Industry</CardTitle>
              <CardDescription>
                Strengths, weaknesses, opportunities, and threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={data.industries[0]} className="w-full">
                <TabsList className="flex flex-wrap h-auto py-1 gap-1">
                  {data.industries.map(industry => (
                    <TabsTrigger key={industry} value={industry} className="h-7 text-xs px-2">
                      {industry}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {data.industries.map(industry => {
                  const swotData = generateSwotForIndustry(industry, data);
                  
                  return (
                    <TabsContent key={industry} value={industry} className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3 bg-green-50">
                          <h3 className="text-sm font-semibold mb-2 text-green-700">Strengths</h3>
                          <ul className="text-xs space-y-1">
                            {swotData.strengths.map((item, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-3 bg-red-50">
                          <h3 className="text-sm font-semibold mb-2 text-red-700">Weaknesses</h3>
                          <ul className="text-xs space-y-1">
                            {swotData.weaknesses.map((item, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-3 bg-blue-50">
                          <h3 className="text-sm font-semibold mb-2 text-blue-700">Opportunities</h3>
                          <ul className="text-xs space-y-1">
                            {swotData.opportunities.map((item, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-3 bg-amber-50">
                          <h3 className="text-sm font-semibold mb-2 text-amber-700">Threats</h3>
                          <ul className="text-xs space-y-1">
                            {swotData.threats.map((item, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-amber-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const PositioningMatrix = ({ data, selectedIndustry }: { data: any, selectedIndustry: string }) => {
  // Filter data by selected industry and process it
  const matrixData = data.cxIndexData
    .filter((item: any) => item.industry === selectedIndustry)
    .map((item: any) => {
      const baseShare = (item.cxIndex - 60) / 2;
      const variance = Math.random() * 6 - 3;
      const marketShare = Math.max(0.1, Math.min(15, baseShare + variance));
      
      return {
        ...item,
        marketShare: parseFloat(marketShare.toFixed(1)),
        size: 20  // Size for bubbles in the scatter plot
      };
    });
  
  // Custom tooltip for the scatter plot
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
          <p className="font-medium">{item.organization}</p>
          <div className="text-xs mt-1 space-y-1">
            <p>CX Index: <span className="font-medium">{item.cxIndex}</span></p>
            <p>Market Share: <span className="font-medium">{item.marketShare}%</span></p>
            <p>Industry: <span className="font-medium">{item.industry}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Function to determine bubble color based on CX Index
  const getBubbleColor = (cxIndex: number) => {
    if (cxIndex >= 85) return "#10b981"; // High - green
    if (cxIndex >= 75) return "#3b82f6"; // Medium-high - blue
    if (cxIndex >= 65) return "#f59e0b"; // Medium - yellow/orange
    return "#ef4444"; // Low - red
  };

  // Find quadrant boundaries for annotation
  const avgCX = matrixData.reduce((sum: number, item: any) => sum + item.cxIndex, 0) / matrixData.length;
  const avgMarketShare = matrixData.reduce((sum: number, item: any) => sum + item.marketShare, 0) / matrixData.length;

  return (
    <div className="h-full w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="cxIndex" 
            name="CX Index" 
            domain={[60, 95]}
            label={{ value: 'CX Index Score', position: 'bottom', offset: 0 }}
          />
          <YAxis 
            type="number" 
            dataKey="marketShare" 
            name="Market Share (%)" 
            label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis type="number" dataKey="size" range={[100, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Add quadrant dividers */}
          <Scatter 
            name={`${selectedIndustry} Organizations`} 
            data={matrixData} 
            fill="#8884d8"
            shape={(props) => {
              // Custom shape to create colored circles
              const { cx, cy, fill, r } = props;
              const item = props.payload;
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={r} 
                  fill={getBubbleColor(item.cxIndex)}
                  stroke="#fff"
                  strokeWidth={1}
                  fillOpacity={0.8}
                />
              );
            }}
          />

          {/* Quadrant labels */}
          <Scatter
            data={[
              { cxIndex: avgCX + 10, marketShare: avgMarketShare + 2, label: "Leaders", size: 0 },
              { cxIndex: avgCX - 10, marketShare: avgMarketShare + 2, label: "Challengers", size: 0 },
              { cxIndex: avgCX - 10, marketShare: avgMarketShare - 2, label: "Laggards", size: 0 },
              { cxIndex: avgCX + 10, marketShare: avgMarketShare - 2, label: "Specialists", size: 0 },
            ]}
            shape={(props) => {
              const { cx, cy } = props;
              const item = props.payload;
              return (
                <text 
                  x={cx} 
                  y={cy} 
                  dy={-10}
                  textAnchor="middle" 
                  fill="#555"
                  fontSize={10}
                  fontWeight="bold"
                >
                  {item.label}
                </text>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const generateSwotForIndustry = (industry: string, data: any) => {
  const industryData = data.cxIndexData.filter((item: any) => item.industry === industry);
  const industryLoadings = data.industryLoadings.find((item: any) => item.industry === industry);
  const competitiveData = data.competitiveLandscape.filter((item: any) => item.industry === industry);
  
  const sortedByPerformance = [...industryData].sort((a, b) => b.cxIndex - a.cxIndex);
  const topPerformer = sortedByPerformance[0];
  const bottomPerformer = sortedByPerformance[sortedByPerformance.length - 1];
  
  const dimensions = Object.entries(industryLoadings || {})
    .filter(([key]) => key !== 'industry')
    .sort(([, a], [, b]) => (b as number) - (a as number));
  
  const topDimensions = dimensions.slice(0, 2).map(([key]) => key);
  const weakDimensions = dimensions.slice(-2).map(([key]) => key);
  
  const competitiveTrend = competitiveData.length > 1 ? 
    competitiveData[competitiveData.length - 1].competitiveIntensity - competitiveData[0].competitiveIntensity : 0;
  
  return {
    strengths: [
      `Strong performance in ${topDimensions[0]}`,
      `Top performer (${topPerformer?.organization}) excels in customer satisfaction`,
      `Industry average CX Index above ${Math.round((industryData.reduce((sum, item) => sum + item.cxIndex, 0) / industryData.length))}`,
      `Effective ${topDimensions[1]} strategies across most organizations`
    ],
    weaknesses: [
      `Underperformance in ${weakDimensions[0]} across the industry`,
      `Bottom performer (${bottomPerformer?.organization}) needs significant improvement`,
      `Inconsistent ${weakDimensions[1]} delivery`,
      `High performance gap between top and bottom players (${(topPerformer?.cxIndex - bottomPerformer?.cxIndex).toFixed(1)} points)`
    ],
    opportunities: [
      `Potential for growth by focusing on ${weakDimensions[0]} improvement`,
      `Increased customer loyalty through better ${topDimensions[0]} execution`,
      `Digital transformation to enhance overall customer experience`,
      `Personalization strategies to differentiate from competitors`
    ],
    threats: [
      `${competitiveTrend > 0 ? 'Increasing' : 'High'} competitive intensity in the market`,
      `Changing customer expectations requiring continuous adaptation`,
      `Potential new market entrants with innovative CX approaches`,
      `Economic pressures affecting customer spending behavior`
    ]
  };
};

export default CompetitiveData;
