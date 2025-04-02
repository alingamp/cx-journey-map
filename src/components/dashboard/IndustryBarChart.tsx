
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BarChartWithLabels from './BarChartWithLabels';

interface IndustryBarChartProps {
  data: any[];
}

const IndustryBarChart: React.FC<IndustryBarChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CX Trends Across Industries</CardTitle>
        <CardDescription>
          Year-over-year change in Customer Experience Index
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <BarChartWithLabels data={data} />
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryBarChart;
