
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Building, ArrowRight } from 'lucide-react';
import MarketOverviewTab from '@/components/dashboard/MarketOverviewTab';
import IndustryOverview from '@/components/dashboard/IndustryOverview';
import IndustryCharts from '@/components/dashboard/IndustryCharts';
import IndustryStatCards from '@/components/dashboard/IndustryStatCards';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
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
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">CX Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Overview of industry and organizational performance
        </p>
      </div>

      {/* Summary Cards with Links to Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="transition hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Industry Dashboard</CardTitle>
            <CardDescription>
              Comprehensive industry analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              View industry trends, competitive landscape, and CX factors in one dashboard
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/industry-dashboard">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>View Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="transition hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Organization Performance</CardTitle>
            <CardDescription>
              Company-specific analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Detailed performance metrics for specific organizations
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/organization">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>View Performance</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="transition hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer Insights</CardTitle>
            <CardDescription>
              Voice of customer analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Survey responses, feedback trends, and customer sentiment
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/customer-insights">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>View Insights</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Quick Industry Analysis
          </h2>
          <p className="text-muted-foreground">
            Select an industry to view its overview
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
          </TabsList>
        </div>
        
        {/* Industry Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <IndustryOverview 
              data={data.industryHistoricalData} 
              selectedIndustry={selectedIndustry} 
            />
            
            <div className="flex justify-end">
              <Link to="/industry-dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <span>View Full Industry Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="space-y-6">
            <IndustryStatCards selectedIndustryTrend={selectedIndustryTrend} />
            <div className="flex justify-end">
              <Link to="/industry-dashboard?tab=trends">
                <Button variant="outline" className="flex items-center gap-2">
                  <span>View Detailed Trend Analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
        
        {/* Competitive Landscape Tab */}
        <TabsContent value="competition">
          <div className="space-y-6">
            <MarketOverviewTab data={data} />
            <div className="flex justify-end">
              <Link to="/industry-dashboard?tab=competition">
                <Button variant="outline" className="flex items-center gap-2">
                  <span>View Full Competitive Analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
