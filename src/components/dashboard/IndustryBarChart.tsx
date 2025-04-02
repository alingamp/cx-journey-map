
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BarChartWithLabels from './BarChartWithLabels';

interface IndustryBarChartProps {
  data: any[];
  title?: string;
  description?: string;
  valueLabel?: string;
  secondaryValueLabel?: string;
  showTrend?: boolean;
}

const IndustryBarChart: React.FC<IndustryBarChartProps> = ({ 
  data, 
  title = "CX Trends Across Industries",
  description = "Year-over-year change in Customer Experience Index",
  valueLabel,
  secondaryValueLabel,
  showTrend = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto pr-2">
          <BarChartWithLabels 
            data={data} 
            valueLabel={valueLabel} 
            secondaryValueLabel={secondaryValueLabel}
            showTrend={showTrend} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryBarChart;
