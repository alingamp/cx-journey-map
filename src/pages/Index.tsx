
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllData, generateCompetitiveLandscape } from '@/services/mockData';
import MarketOverviewTab from '@/components/dashboard/MarketOverviewTab';
import IndustryAnalysisTab from '@/components/dashboard/IndustryAnalysisTab';
import CompetitiveAnalysisTab from '@/components/dashboard/CompetitiveAnalysisTab';
import FinancialImpactTab from '@/components/dashboard/FinancialImpactTab';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('market');
  const [loading, setLoading] = useState<boolean>(true);
  const [competitiveLandscape, setCompetitiveLandscape] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      const landscape = generateCompetitiveLandscape();
      setData(mockData);
      setCompetitiveLandscape(landscape);
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
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">OW Customer Experience Index</h1>
        <p className="text-gray-500 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Market, industry, and financial analysis of customer experience metrics
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="market" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Market Overview
            </TabsTrigger>
            <TabsTrigger 
              value="industry" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Industry Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="competitive" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Competitive Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Financial Impact
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Market Overview Tab */}
        <TabsContent value="market">
          <MarketOverviewTab data={data} />
        </TabsContent>
        
        {/* Industry Analysis Tab */}
        <TabsContent value="industry">
          <IndustryAnalysisTab data={data} competitiveLandscape={competitiveLandscape} />
        </TabsContent>
        
        {/* Competitive Analysis Tab */}
        <TabsContent value="competitive">
          <CompetitiveAnalysisTab data={data} competitiveLandscape={competitiveLandscape} />
        </TabsContent>
        
        {/* Financial Impact Tab */}
        <TabsContent value="financial">
          <FinancialImpactTab data={data} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
