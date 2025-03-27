
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronUp, ChevronDown, BarChart, LineChart, PieChart, TrendingUp, DollarSign, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllData, generateCompetitiveLandscape } from '@/services/mockData';
import CXIndexSummary from '@/components/CXIndexSummary';
import IndustryLoadings from '@/components/IndustryLoadings';
import FeedbackDiagnostics from '@/components/FeedbackDiagnostics';
import ExperienceImpact from '@/components/ExperienceImpact';
import PassiveMetrics from '@/components/PassiveMetrics';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';
import CompetitiveLandscape from '@/components/CompetitiveLandscape';
import FinancialImpact from '@/components/FinancialImpact';
import IndustryFocusChart from '@/components/charts/IndustryFocusChart';
import CompetitiveIntensityChart from '@/components/charts/CompetitiveIntensityChart';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('market');
  const [industryTab, setIndustryTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFinancialIndustry, setSelectedFinancialIndustry] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [competitiveLandscape, setCompetitiveLandscape] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      const landscape = generateCompetitiveLandscape();
      setData(mockData);
      setCompetitiveLandscape(landscape);
      setSelectedFinancialIndustry(mockData.industries[0]);
      setSelectedIndustry(mockData.industries[0]);
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
  
  // Calculate industry metrics for selected industry
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
  
  const BarChartWithLabels = ({ data }: { data: any[] }) => {
    const sortedData = [...data].sort((a, b) => b.change - a.change);
    
    return (
      <div className="space-y-4">
        {sortedData.map((item) => (
          <div key={item.industry} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.industry}</span>
              <span className="font-medium flex items-center">
                {item.isImproving ? (
                  <ChevronUp className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1 text-red-500" />
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
        <TabsContent value="market" className="pt-4 mt-0 animate-fade-in">
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
        
        {/* Industry Analysis Tab */}
        <TabsContent value="industry" className="pt-4 mt-0 animate-fade-in">
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
                  {data.industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={industryTab} onValueChange={setIndustryTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Industry Overview</TabsTrigger>
              <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
              <TabsTrigger value="factors">CX Factors</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Industries Analyzed</CardTitle>
                    <CardDescription>Number of industries in analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{data.industries.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Organizations</CardTitle>
                    <CardDescription>Total organizations in the dataset</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Object.values(data.organizations).reduce((acc: number, orgs: any[]) => acc + orgs.length, 0)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>CX Dimensions</CardTitle>
                    <CardDescription>Customer experience metrics tracked</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{data.cxDimensions.length}</div>
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
                  <div className="h-[350px]">
                    <BarChartWithLabels data={cxIndexTrend} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
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
                        <ChevronUp className="mr-1 text-green-500" />
                      ) : (
                        <ChevronDown className="mr-1 text-red-500" />
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
                        <ChevronUp className="mr-1 text-green-500" />
                      ) : (
                        <ChevronDown className="mr-1 text-red-500" />
                      )}
                      {selectedIndustryTrend?.percentChange}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Focus Evolution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Focus Evolution</CardTitle>
                    <CardDescription>
                      Shift between experiential and commodity competition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <IndustryFocusChart 
                        data={competitiveLandscape.filter(item => item.industry === selectedIndustry)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Competitive Intensity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Intensity Trend</CardTitle>
                    <CardDescription>
                      Changes in competitive intensity over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CompetitiveIntensityChart 
                        data={competitiveLandscape.filter(item => item.industry === selectedIndustry)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CX Factors Tab */}
            <TabsContent value="factors">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Industry Factor Loadings</CardTitle>
                  <CardDescription>
                    How different CX factors contribute to customer satisfaction across industries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IndustryLoadings 
                    data={data.industryLoadings}
                    industries={data.industries}
                    dimensions={data.cxDimensions}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Key Industry Differentiators</CardTitle>
                    <CardDescription>What makes each industry unique in CX</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={data.industries[0]} className="w-full">
                      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                        {data.industries.map(industry => (
                          <TabsTrigger key={industry} value={industry}>
                            {industry.split('/')[0]}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {data.industries.map(industry => {
                        // Find the top dimensions for this industry
                        const industryData = data.industryLoadings.find(item => item.industry === industry);
                        const dimensions = industryData ? 
                          Object.entries(industryData)
                            .filter(([key]) => key !== 'industry')
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 3)
                            .map(([key]) => key) : [];
                        
                        return (
                          <TabsContent key={industry} value={industry} className="mt-6">
                            <h3 className="text-lg font-medium mb-2">Top 3 Differentiators</h3>
                            <ul className="space-y-2">
                              {dimensions.map((dim, index) => (
                                <li key={dim} className="flex items-center gap-2">
                                  <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">
                                    {index + 1}
                                  </div>
                                  <span>{dim}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Competitive Analysis Tab */}
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
              data={competitiveLandscape} 
              industries={data.industries} 
            />
          </div>
        </TabsContent>
        
        {/* Financial Impact Tab */}
        <TabsContent value="financial" className="pt-4 mt-0 animate-fade-in">
          {/* Financial Impact Analysis */}
          <div className="grid grid-cols-1 gap-6">
            <FinancialImpact 
              data={data.financialImpact} 
              industries={data.industries} 
              organizations={data.organizations}
              selectedIndustry={selectedFinancialIndustry} 
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
