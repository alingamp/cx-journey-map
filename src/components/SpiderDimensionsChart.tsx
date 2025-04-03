
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface SpiderDimensionData {
  dimension: string;
  ATT: number;
  Verizon?: number;
  TMobile?: number;
  fullName: string;
}

interface SpiderDimensionsChartProps {
  data: SpiderDimensionData[];
}

// Custom tooltip component for the radar chart
const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-gray-200 text-sm">
        <p className="font-semibold mb-1">{payload[0]?.payload.dimension}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.name}:</span>
            <span>{entry.value}</span>
          </div>
        ))}
        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
          {payload[0]?.payload.fullName}
        </p>
      </div>
    );
  }
  return null;
};

const SpiderDimensionsChart: React.FC<SpiderDimensionsChartProps> = ({ data }) => {
  const [showCompetitors, setShowCompetitors] = useState(false);
  const isMobile = useIsMobile();

  const handleToggleCompetitors = () => {
    setShowCompetitors(!showCompetitors);
  };

  const legendHeight = showCompetitors ? (isMobile ? 40 : 30) : (isMobile ? 25 : 20);
  const chartHeight = isMobile ? 300 : 400;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Customer Experience Dimensions</CardTitle>
            <CardDescription>How customers feel across key experience dimensions</CardDescription>
          </div>
          <Toggle 
            pressed={showCompetitors} 
            onPressedChange={handleToggleCompetitors}
            className="mt-2 sm:mt-0 sm:ml-auto"
            aria-label="Toggle competitors view"
          >
            {showCompetitors ? "Hide Competitors" : "Show Competitors"}
          </Toggle>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`h-[${chartHeight}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 10]} 
                tick={{ fontSize: isMobile ? 9 : 11 }}
                tickCount={6}
                stroke="#e5e7eb"
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Radar 
                name="AT&T" 
                dataKey="ATT" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3} 
                strokeWidth={2}
              />
              
              {showCompetitors && (
                <>
                  <Radar 
                    name="Verizon" 
                    dataKey="Verizon" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.2} 
                    strokeWidth={2}
                  />
                  <Radar 
                    name="T-Mobile" 
                    dataKey="TMobile" 
                    stroke="#ec4899" 
                    fill="#ec4899" 
                    fillOpacity={0.2} 
                    strokeWidth={2} 
                  />
                </>
              )}
              
              <Legend 
                layout={isMobile ? "horizontal" : "horizontal"} 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '10px' }}
                height={legendHeight}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {data.map(item => (
              <div key={item.dimension} className="flex items-center">
                <span className="font-medium">{item.dimension}:</span>
                <span className="ml-1">{item.fullName}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpiderDimensionsChart;
