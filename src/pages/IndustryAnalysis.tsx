
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, ChevronDown } from 'lucide-react';
import IndustryLoadings from '@/components/IndustryLoadings';
import { getAllData } from '@/services/mockData';

const IndustryAnalysis = () => {
  const data = getAllData();
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building className="h-8 w-8 text-primary" />
              Industry Analysis
            </h1>
            <p className="text-muted-foreground">
              Compare CX factor importance across different industries
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        <Card className="mt-8">
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Industry CX Index Comparison</CardTitle>
              <CardDescription>Average CX score by industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <IndustryAverageComparison data={data.cxIndexData} industries={data.industries} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Key Industry Differentiators</CardTitle>
              <CardDescription>What makes each industry unique in CX</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={data.industries[0]} className="w-full">
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.industries.map(industry => (
                    <TabsTrigger key={industry} value={industry}>
                      {industry}
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
      </div>
    </DashboardLayout>
  );
};

// Helper component for industry average comparison
const IndustryAverageComparison = ({ data, industries }: { data: any[], industries: string[] }) => {
  // Calculate average CX score by industry
  const averageByIndustry = industries.map(industry => {
    const industryData = data.filter(item => item.industry === industry);
    const average = industryData.reduce((acc, item) => acc + item.cxIndex, 0) / industryData.length;
    return {
      industry,
      average: parseFloat(average.toFixed(1))
    };
  }).sort((a, b) => b.average - a.average);

  return (
    <div className="space-y-4">
      {averageByIndustry.map((item, index) => (
        <div key={item.industry} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.industry}</span>
            <span className="font-medium">{item.average}</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${(item.average / 100) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndustryAnalysis;
