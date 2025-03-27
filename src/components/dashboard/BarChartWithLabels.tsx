
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface IndustryTrend {
  industry: string;
  currentYear: number;
  lastYear: number;
  change: number;
  percentChange: number;
  isImproving: boolean;
}

interface BarChartWithLabelsProps {
  data: IndustryTrend[];
}

const BarChartWithLabels: React.FC<BarChartWithLabelsProps> = ({ data }) => {
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

export default BarChartWithLabels;
