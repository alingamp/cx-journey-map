
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import IndustryFocusChart from '@/components/charts/IndustryFocusChart';
import CompetitiveIntensityChart from '@/components/charts/CompetitiveIntensityChart';
import { CompetitiveLandscape } from '@/services/mockData';

// Define interfaces for the chart data to fix type errors
interface IndustryChartsFocusData extends CompetitiveLandscape {
  year: number;
  experientialFocus: number;
  commodityFocus: number;
}

interface IndustryChartsIntensityData extends CompetitiveLandscape {
  year: number;
  competitiveIntensity: number;
}

interface IndustryChartsProps {
  competitiveLandscape: CompetitiveLandscape[];
  selectedIndustry: string;
}

const IndustryCharts: React.FC<IndustryChartsProps> = ({ competitiveLandscape, selectedIndustry }) => {
  const filteredData = competitiveLandscape.filter(item => item.industry === selectedIndustry);
  const hasData = filteredData.length > 0;

  return (
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
            {hasData ? (
              <IndustryFocusChart data={filteredData as any} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available for selected industry
              </div>
            )}
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
            {hasData ? (
              <CompetitiveIntensityChart data={filteredData as any} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available for selected industry
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryCharts;
