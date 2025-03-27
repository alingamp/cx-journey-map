
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface IndustryTrend {
  currentYear: number;
  lastYear: number;
  change: number;
  percentChange: number;
}

interface IndustryStatCardsProps {
  selectedIndustryTrend: IndustryTrend | null;
}

const IndustryStatCards: React.FC<IndustryStatCardsProps> = ({ selectedIndustryTrend }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current CX Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {selectedIndustryTrend?.currentYear || 0}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Last Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {selectedIndustryTrend?.lastYear || 0}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            {selectedIndustryTrend && selectedIndustryTrend.change > 0 ? (
              <ChevronUp className="mr-1 text-green-500" />
            ) : (
              <ChevronDown className="mr-1 text-red-500" />
            )}
            {selectedIndustryTrend?.change || 0}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">% Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            {selectedIndustryTrend && selectedIndustryTrend.percentChange > 0 ? (
              <ChevronUp className="mr-1 text-green-500" />
            ) : (
              <ChevronDown className="mr-1 text-red-500" />
            )}
            {selectedIndustryTrend?.percentChange || 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryStatCards;
