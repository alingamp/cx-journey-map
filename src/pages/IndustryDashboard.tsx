
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, LineChart, BarChart, TrendingUp } from 'lucide-react';
import { getAllData, generateCompetitiveLandscape } from '@/services/mockData';
import IndustryOverview from '@/components/dashboard/IndustryOverview';
import IndustryStatCards from '@/components/dashboard/IndustryStatCards';
import IndustryCharts from '@/components/dashboard/IndustryCharts';
import IndustryFactors from '@/components/dashboard/IndustryFactors';
import MarketOverviewTab from '@/components/dashboard/MarketOverviewTab';
import TelecomCompaniesSummary from '@/components/dashboard/TelecomCompaniesSummary';
import IndustryBarChart from '@/components/dashboard/IndustryBarChart';

const IndustryDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<string>("Telecom");
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);
  
  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Loading dashboard data</h3>
            <p className="text-gray-500 mt-1">Please wait while we prepare your insights</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Generate competitive landscape data for the selected industry
  const competitiveLandscape = generateCompetitiveLandscape(selectedIndustry);
  
  // Calculate industry metrics for selected industry
  const cxIndexTrend = data.industries.map((industry: string) => {
    const industryData = data.cxIndexData.filter((item: any) => item.industry === industry);
    const average = parseFloat((industryData.reduce((acc: number, item: any) => acc + item.cxIndex, 0) / industryData.length).toFixed(1));
    const lastYearAverage = parseFloat((industryData.reduce((acc: number, item: any) => acc + item.lastYearIndex, 0) / industryData.length).toFixed(1));
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
  
  const selectedIndustryTrend = cxIndexTrend.find(item => item.industry === selectedIndustry) || null;

  // Get telecom-specific companies and their metrics
  const telecomCompanies = data.organizations["Telecom"] || [];
  const telecomMetrics = telecomCompanies.map((company: string) => {
    // Find CX index data for this company
    const cxData = data.cxIndexData.find((item: any) => 
      item.organization === company && item.industry === "Telecom"
    );
    
    // Generate mock direct feedback and passive metrics scores
    const directFeedbackScore = 65 + Math.floor(Math.random() * 25);
    const passiveMetricsScore = 60 + Math.floor(Math.random() * 30);
    
    return {
      organization: company,
      cxIndex: cxData ? cxData.cxIndex : 'N/A',
      directFeedback: directFeedbackScore,
      passiveMetrics: passiveMetricsScore,
      trend: cxData ? (cxData.cxIndex > cxData.lastYearIndex ? 'up' : 'down') : 'neutral'
    };
  }).sort((a, b) => {
    if (typeof a.cxIndex === 'number' && typeof b.cxIndex === 'number') {
      return b.cxIndex - a.cxIndex;
    }
    return 0;
  });
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Industry Dashboard</h1>
        <p className="text-gray-500 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Comprehensive industry analysis and competitive insights
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Industry Analysis
          </h2>
          <p className="text-muted-foreground">
            Analyze industry competition, CX trends, and factor importance
          </p>
        </div>
        
        <div className="w-full lg:w-72">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {data.industries.map((industry: string) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Telecom Companies Summary Section - Only shown when Telecom is selected */}
      {selectedIndustry === "Telecom" && (
        <TelecomCompaniesSummary telecomMetrics={telecomMetrics} />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Industry Overview
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Trend Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="competition" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Competitive Landscape
            </TabsTrigger>
            <TabsTrigger 
              value="factors" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              CX Factors
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Industry Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            {data.industryHistoricalData && (
              <IndustryOverview 
                data={data.industryHistoricalData} 
                selectedIndustry={selectedIndustry} 
              />
            )}
            
            {selectedIndustry === "Telecom" && (
              <Card>
                <CardHeader>
                  <CardTitle>Telecom Industry Leaders</CardTitle>
                  <CardDescription>
                    Key players in the telecommunications market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.organizations["Telecom"].slice(0, 6).map((org: string, index: number) => {
                      const orgData = data.cxIndexData.find((item: any) => 
                        item.organization === org && item.industry === "Telecom"
                      );
                      return (
                        <div key={index} className="flex items-center p-3 border rounded-md">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{org}</p>
                            <p className="text-sm text-muted-foreground">
                              CX Index: {orgData ? orgData.cxIndex : 'N/A'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="space-y-6">
            <IndustryStatCards selectedIndustryTrend={selectedIndustryTrend} />
            <IndustryCharts 
              competitiveLandscape={competitiveLandscape} 
              selectedIndustry={selectedIndustry} 
            />
            
            <IndustryBarChart data={cxIndexTrend} />
          </div>
        </TabsContent>
        
        {/* Competitive Landscape Tab */}
        <TabsContent value="competition">
          <MarketOverviewTab data={data} />
        </TabsContent>
        
        {/* CX Factors Tab */}
        <TabsContent value="factors">
          <IndustryFactors data={data} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default IndustryDashboard;
