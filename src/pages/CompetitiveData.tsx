
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart as PieChartIcon, BarChart2, TrendingUp, Target, Shield } from 'lucide-react';
import CXIndexSummary from '@/components/CXIndexSummary';
import CompetitiveLandscape from '@/components/CompetitiveLandscape';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';
import { getAllData } from '@/services/mockData';

const CompetitiveData = () => {
  const data = getAllData();
  
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
              organizations={data.organizations}
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
              organizations={data.organizations}
              metrics={data.financialMetrics}
            />
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Positioning Matrix</CardTitle>
              <CardDescription>
                Comparing CX performance vs market share
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PositioningMatrix data={data} />
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

// Positioning Matrix component
const PositioningMatrix = ({ data }: { data: any }) => {
  // For this demo, we'll assume market share is derived from CX Index and randomized
  const matrixData = data.cxIndexData.map((item: any) => {
    // Calculate a mock market share value correlated with CX Index but with some variance
    const baseShare = (item.cxIndex - 60) / 2; // Base percentage derived from CX
    const variance = Math.random() * 6 - 3; // +/- 3% variance
    const marketShare = Math.max(0.1, Math.min(15, baseShare + variance)); // Clamp between 0.1 and 15
    
    return {
      ...item,
      marketShare: parseFloat(marketShare.toFixed(1))
    };
  });
  
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="text-center text-sm text-muted-foreground">
        <p>Positioning Matrix visualization would go here</p>
        <p>Showing CX Index vs. Market Share for all organizations</p>
      </div>
    </div>
  );
};

// Generate SWOT analysis data for each industry based on mock data
const generateSwotForIndustry = (industry: string, data: any) => {
  // Get industry-specific data
  const industryData = data.cxIndexData.filter((item: any) => item.industry === industry);
  const industryLoadings = data.industryLoadings.find((item: any) => item.industry === industry);
  const competitiveData = data.competitiveLandscape.filter((item: any) => item.industry === industry);
  
  // Get top and bottom performers
  const sortedByPerformance = [...industryData].sort((a, b) => b.cxIndex - a.cxIndex);
  const topPerformer = sortedByPerformance[0];
  const bottomPerformer = sortedByPerformance[sortedByPerformance.length - 1];
  
  // Get top CX dimensions for this industry
  const dimensions = Object.entries(industryLoadings || {})
    .filter(([key]) => key !== 'industry')
    .sort(([, a], [, b]) => (b as number) - (a as number));
  
  const topDimensions = dimensions.slice(0, 2).map(([key]) => key);
  const weakDimensions = dimensions.slice(-2).map(([key]) => key);
  
  // Get competitive trend
  const competitiveTrend = competitiveData.length > 1 ? 
    competitiveData[competitiveData.length - 1].competitiveIntensity - competitiveData[0].competitiveIntensity : 0;
  
  // Generate SWOT based on the data
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
