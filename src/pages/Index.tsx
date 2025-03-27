
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronUp, ChevronDown, BarChart, LineChart, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAllData } from '@/services/mockData';
import CXIndexSummary from '@/components/CXIndexSummary';
import IndustryLoadings from '@/components/IndustryLoadings';
import FeedbackDiagnostics from '@/components/FeedbackDiagnostics';
import ExperienceImpact from '@/components/ExperienceImpact';
import PassiveMetrics from '@/components/PassiveMetrics';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';
import CompetitiveLandscape from '@/components/CompetitiveLandscape';
import FinancialImpact from '@/components/FinancialImpact';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  
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
  
  // Extract top and bottom performers from CX Index data
  const topPerformer = data.cxIndexData.reduce((prev: any, curr: any) => 
    prev.cxIndex > curr.cxIndex ? prev : curr
  );
  
  const bottomPerformer = data.cxIndexData.reduce((prev: any, curr: any) => 
    prev.cxIndex < curr.cxIndex ? prev : curr
  );
  
  // Calculate overall average CX score
  const avgCXScore = data.cxIndexData.reduce((sum: number, item: any) => 
    sum + item.cxIndex, 0
  ) / data.cxIndexData.length;
  
  // Find most improved organization
  const mostImproved = data.cxIndexData.reduce((prev: any, curr: any) => {
    const prevImprovement = prev.cxIndex - prev.lastYearIndex;
    const currImprovement = curr.cxIndex - curr.lastYearIndex;
    return prevImprovement > currImprovement ? prev : curr;
  });
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">CX Journey Dashboard</h1>
        <p className="text-gray-500 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Interactive analysis of customer experience metrics and financial impacts
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Overview
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
        
        <TabsContent value="overview" className="pt-4 mt-0 animate-fade-in">
          {/* Summary stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card hover-scale">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average CX Score</p>
                    <p className="text-3xl font-bold">{avgCXScore.toFixed(1)}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <BarChart size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="success" className="flex items-center gap-1">
                    <ChevronUp size={14} />
                    2.3%
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">vs. last year</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Top Performer</p>
                    <p className="text-xl font-bold">{topPerformer.organization}</p>
                    <p className="text-sm text-gray-500">{topPerformer.industry}</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="success" className="flex items-center gap-1">
                    <ChevronUp size={14} />
                    Score: {topPerformer.cxIndex}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Needs Improvement</p>
                    <p className="text-xl font-bold">{bottomPerformer.organization}</p>
                    <p className="text-sm text-gray-500">{bottomPerformer.industry}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <ChevronDown size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="destructive" className="flex items-center gap-1">
                    Score: {bottomPerformer.cxIndex}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Most Improved</p>
                    <p className="text-xl font-bold">{mostImproved.organization}</p>
                    <p className="text-sm text-gray-500">{mostImproved.industry}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <LineChart size={20} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="success" className="flex items-center gap-1">
                    <ChevronUp size={14} />
                    +{(mostImproved.cxIndex - mostImproved.lastYearIndex).toFixed(1)}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">Year over year</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* CX Index Summary and Industry Loadings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CXIndexSummary 
              data={data.cxIndexData} 
              industries={data.industries} 
            />
            <IndustryLoadings 
              data={data.industryLoadings} 
              industries={data.industries} 
              dimensions={data.cxDimensions} 
            />
          </div>
          
          {/* Feedback Diagnostics and Experience Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FeedbackDiagnostics 
              data={data.feedbackDiagnostics} 
              industries={data.industries} 
              organizations={data.organizations} 
              dimensions={data.cxDimensions} 
            />
            <ExperienceImpact 
              data={data.experienceImpact} 
              industries={data.industries} 
              organizations={data.organizations} 
              dimensions={data.cxDimensions} 
            />
          </div>
          
          {/* Passive Metrics Visualization */}
          <div className="grid grid-cols-1 gap-6">
            <PassiveMetrics 
              data={data.passiveMetrics} 
              industries={data.industries} 
              organizations={data.organizations} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="competitive" className="pt-4 mt-0 animate-fade-in">
          {/* Correlation Analysis and Competitive Landscape */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <CorrelationAnalysis 
              data={data.correlationData} 
              industries={data.industries} 
              financialMetrics={data.financialMetrics} 
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <CompetitiveLandscape 
              data={data.competitiveLandscape} 
              industries={data.industries} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="pt-4 mt-0 animate-fade-in">
          {/* Financial Impact Analysis */}
          <div className="grid grid-cols-1 gap-6">
            <FinancialImpact 
              data={data.financialImpact} 
              industries={data.industries} 
              organizations={data.organizations} 
            />
          </div>
          
          {/* Financial insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card className="glass-card hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign size={18} className="text-primary" />
                  Revenue Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Organizations with high CX scores show on average 4.2% higher revenue growth compared to industry peers with lower scores.
                </p>
                <div className="text-xs text-gray-500">
                  Based on correlation analysis across {data.industries.length} industries
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart size={18} className="text-primary" />
                  Industry Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  CX investment is becoming increasingly critical in {data.industries[1]} and {data.industries[6]} as these sectors show the strongest correlation between CX and financial performance.
                </p>
                <div className="text-xs text-gray-500">
                  Based on 5-year competitive landscape analysis
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart size={18} className="text-primary" />
                  ROI Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  A 10-point improvement in CX score is projected to yield a 3.8% increase in retention and 2.5% improvement in profit margins across analyzed organizations.
                </p>
                <div className="text-xs text-gray-500">
                  Based on financial impact simulations
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
