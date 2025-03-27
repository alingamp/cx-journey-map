import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart as PieChartIcon, BarChart2, TrendingUp, Target, Shield } from 'lucide-react';
import CXIndexSummary from '@/components/CXIndexSummary';
import CompetitiveLandscape from '@/components/CompetitiveLandscape';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';
import { getAllData } from '@/services/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';

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
            <CardContent className="h-[400px] pb-8">
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
  const matrixData = data.cxIndexData
    .filter((item: any) => item.industry === selectedIndustry)
    .map((item: any) => {
      const baseShare = (item.cxIndex - 60) / 3;
      const variance = Math.random() * 2 - 1;
      const marketShare = Math.max(0.5, Math.min(15, baseShare + variance));
      
      return {
        ...item,
        marketShare: parseFloat(marketShare.toFixed(1)),
        size: 800,
        fill: getQuadrantColor(item.cxIndex, marketShare, data.cxIndexData.filter((d: any) => d.industry === selectedIndustry))
      };
    });
  
  const avgCX = matrixData.reduce((sum: number, item: any) => sum + item.cxIndex, 0) / matrixData.length;
  const avgMarketShare = matrixData.reduce((sum: number, item: any) => sum + item.marketShare, 0) / matrixData.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
          <p className="font-medium">{item.organization}</p>
          <div className="text-xs mt-1 space-y-1">
            <p>CX Index: <span className="font-medium">{item.cxIndex.toFixed(1)}</span></p>
            <p>Market Share: <span className="font-medium">{item.marketShare}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const QuadrantLabels = () => {
    const minCX = Math.min(...matrixData.map((d: any) => d.cxIndex)) - 5;
    const maxCX = Math.max(...matrixData.map((d: any) => d.cxIndex)) + 5;
    const minShare = 0;
    const maxShare = Math.max(...matrixData.map((d: any) => d.marketShare)) + 2;
    
    return (
      <>
        <text 
          x={avgCX + (maxCX - avgCX) / 2} 
          y={avgMarketShare + (maxShare - avgMarketShare) / 4}
          textAnchor="middle" 
          fill="#2E7D32"
          fontSize={12}
          fontWeight="bold"
        >
          Leaders
        </text>
        
        <text 
          x={minCX + (avgCX - minCX) / 2} 
          y={avgMarketShare + (maxShare - avgMarketShare) / 4}
          textAnchor="middle" 
          fill="#1565C0"
          fontSize={12}
          fontWeight="bold"
        >
          Challengers
        </text>
        
        <text 
          x={minCX + (avgCX - minCX) / 2} 
          y={minShare + avgMarketShare / 4}
          textAnchor="middle" 
          fill="#C62828"
          fontSize={12}
          fontWeight="bold"
        >
          Laggards
        </text>
        
        <text 
          x={avgCX + (maxCX - avgCX) / 2} 
          y={minShare + avgMarketShare / 4}
          textAnchor="middle" 
          fill="#F57F17"
          fontSize={12}
          fontWeight="bold"
        >
          Specialists
        </text>
      </>
    );
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          <XAxis 
            type="number" 
            dataKey="cxIndex" 
            name="CX Index" 
            domain={['dataMin - 2', 'dataMax + 2']}
            tickCount={5}
            label={{ 
              value: 'CX Index Score', 
              position: 'insideBottom', 
              offset: -10,
              style: { textAnchor: 'middle', fontSize: 12 }
            }}
          />
          
          <YAxis 
            type="number" 
            dataKey="marketShare" 
            name="Market Share (%)" 
            domain={[0, 'dataMax + 2']}
            tickCount={5}
            label={{ 
              value: 'Market Share (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12 }
            }}
          />
          
          <ZAxis type="number" dataKey="size" range={[100, 500]} />
          
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine x={avgCX} stroke="#666" strokeDasharray="3 3" />
          <ReferenceLine y={avgMarketShare} stroke="#666" strokeDasharray="3 3" />
          
          <svg>
            <QuadrantLabels />
          </svg>
          
          <Scatter 
            name={`${selectedIndustry} Organizations`} 
            data={matrixData}
            fillOpacity={0.8}
          />
          
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ 
              paddingTop: 20,
              fontSize: 12
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

const getQuadrantColor = (cxIndex: number, marketShare: number, industryData: any[]) => {
  const avgCX = industryData.reduce((sum, item) => sum + item.cxIndex, 0) / industryData.length;
  const avgMarketShare = industryData.reduce((sum, item) => sum + item.marketShare, 0) / industryData.length;
  
  if (cxIndex >= avgCX && marketShare >= avgMarketShare) {
    return "#2E7D32";
  } else if (cxIndex < avgCX && marketShare >= avgMarketShare) {
    return "#1565C0";
  } else if (cxIndex < avgCX && marketShare < avgMarketShare) {
    return "#C62828";
  } else {
    return "#F57F17";
  }
};

export default CompetitiveData;
