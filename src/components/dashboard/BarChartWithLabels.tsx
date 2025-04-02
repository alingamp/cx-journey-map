
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DataItem {
  label: string;
  value: number;
  isPositive?: boolean;
  secondaryValue?: number;
}

interface BarChartWithLabelsProps {
  data: DataItem[];
  valueLabel?: string;
  secondaryValueLabel?: string;
  showTrend?: boolean;
}

const BarChartWithLabels: React.FC<BarChartWithLabelsProps> = ({ 
  data, 
  valueLabel = "Score", 
  secondaryValueLabel,
  showTrend = false
}) => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  return (
    <div className="space-y-4">
      {sortedData.map((item, index) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <div className="flex items-center gap-4">
              {secondaryValueLabel && item.secondaryValue !== undefined && (
                <span className="text-gray-500">
                  {secondaryValueLabel}: {item.secondaryValue.toFixed(1)}
                </span>
              )}
              <span className="font-medium flex items-center">
                {showTrend && (
                  item.isPositive ? (
                    <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
                  )
                )}
                {valueLabel}: {item.value.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden relative">
            {showTrend ? (
              <div 
                className={`h-full rounded-full absolute top-0 ${item.isPositive ? 'bg-green-500 left-1/2' : 'bg-red-500 right-1/2'}`}
                style={{ 
                  width: `${Math.abs(item.value) * 5}%`,
                  maxWidth: '50%'
                }}
              />
            ) : (
              <div 
                className="h-full rounded-full absolute top-0 left-0 bg-primary"
                style={{ 
                  width: `${(item.value / 100) * 100}%`,
                  maxWidth: '100%'
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChartWithLabels;
