import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart as LineChartIcon, TrendingUp, Building, ArrowUp, ArrowDown } from 'lucide-react';
import { getAllData, generateCompetitiveLandscape, CompetitiveLandscape } from '@/services/mockData';
import IndustryLoadings from '@/components/IndustryLoadings';
import CompetitiveLandscapeComponent from '@/components/CompetitiveLandscape';
import IndustryFocusChart from '@/components/charts/IndustryFocusChart';
import CompetitiveIntensityChart from '@/components/charts/CompetitiveIntensityChart';

const IndustryTrendAnalysis = () => {
  const data = getAllData();
  const [selectedIndustry, setSelectedIndustry] = useState(data.industries[0]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Pass the selectedIndustry to the function
  const competitiveLandscape = generateCompetitiveLandscape(selectedIndustry);
  
  // Calculate industry metrics
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
  
  // Filter landscape data to just get the entries with year data for the charts
  const industryFocusData = competitiveLandscape
    .filter(item => item.year && typeof item.year === 'number' && 
      item.experientialFocus !== undefined && 
      item.commodityFocus !== undefined)
    .map(item => ({
      year: item.year || 0,
      experientialFocus: item.experientialFocus || 0,
      commodityFocus: item.commodityFocus || 0
    }));
  
  const competitiveIntensityData = competitiveLandscape
    .filter(item => item.year && typeof item.year === 'number' && 
      item.competitiveIntensity !== undefined)
    .map(item => ({
      year: item.year || 0,
      competitiveIntensity: item.competitiveIntensity || 0,
      experientialFocus: item.experientialFocus || 0
    }));
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building className="h-8 w-8 text-primary" />
              Industry & Trend Analysis
            </h1>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    {Object.values(data.organizations).reduce((acc, orgs) => acc + orgs.length, 0)}
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

            <div className="grid gap-4 lg:grid-cols-2">
              <CompetitiveLandscapeComponent 
                data={competitiveLandscape}
                industries={data.industries}
              />
              
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
            </div>
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
                    <IndustryFocusChart data={industryFocusData} />
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
                    <CompetitiveIntensityChart data={competitiveIntensityData} />
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

export default IndustryTrendAnalysis;
