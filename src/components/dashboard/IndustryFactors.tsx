
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import IndustryLoadings from '@/components/IndustryLoadings';

interface IndustryFactorsProps {
  data: any;
}

const IndustryFactors: React.FC<IndustryFactorsProps> = ({ data }) => {
  return (
    <>
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
                {data.industries.map((industry: string) => (
                  <TabsTrigger key={industry} value={industry}>
                    {industry.split('/')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {data.industries.map((industry: string) => {
                // Find the top dimensions for this industry
                const industryData = data.industryLoadings.find((item: any) => item.industry === industry);
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
    </>
  );
};

export default IndustryFactors;
