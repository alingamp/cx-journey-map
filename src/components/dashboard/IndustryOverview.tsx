
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import BarChartWithLabels from './BarChartWithLabels';

interface IndustryOverviewProps {
  data: any;
  cxIndexTrend: any[];
}

const IndustryOverview: React.FC<IndustryOverviewProps> = ({ data, cxIndexTrend }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default IndustryOverview;
