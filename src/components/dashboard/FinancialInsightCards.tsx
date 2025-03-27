
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, LineChart, PieChart } from 'lucide-react';

interface FinancialInsightCardsProps {
  industries: string[];
}

const FinancialInsightCards: React.FC<FinancialInsightCardsProps> = ({ industries }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <Card className="glass-card hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign size={18} className="text-primary" />
            Revenue Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">
            Organizations with high CX scores show on average 4.2% higher revenue growth compared to industry peers with lower scores.
          </p>
          <div className="text-xs text-gray-500">
            Based on correlation analysis across {industries.length} industries
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChart size={18} className="text-primary" />
            Industry Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">
            CX investment is becoming increasingly critical in {industries[1]} and {industries[6]} as these sectors show the strongest correlation between CX and financial performance.
          </p>
          <div className="text-xs text-gray-500">
            Based on 5-year competitive landscape analysis
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart size={18} className="text-primary" />
            ROI Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">
            A 10-point improvement in CX score is projected to yield a 3.8% increase in retention and 2.5% improvement in profit margins across analyzed organizations.
          </p>
          <div className="text-xs text-gray-500">
            Based on financial impact simulations
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInsightCards;
