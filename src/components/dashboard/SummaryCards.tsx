
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, BarChart, LineChart, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  avgCXScore: number;
  topPerformer: {
    organization: string;
    industry: string;
    cxIndex: number;
  };
  bottomPerformer: {
    organization: string;
    industry: string;
    cxIndex: number;
  };
  mostImproved: {
    organization: string;
    industry: string;
    cxIndex: number;
    lastYearIndex: number;
  };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  avgCXScore,
  topPerformer,
  bottomPerformer,
  mostImproved
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="glass-card hover-scale">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average CX Score</p>
              <p className="text-3xl font-bold">{avgCXScore.toFixed(1)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <BarChart size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="success" className="flex items-center gap-1">
              <ChevronUp size={14} />
              2.3%
            </Badge>
            <span className="text-xs text-gray-500 ml-2">vs. last year</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card hover-scale">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Top Performer</p>
              <p className="text-xl font-bold">{topPerformer.organization}</p>
              <p className="text-sm text-gray-500">{topPerformer.industry}</p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="success" className="flex items-center gap-1">
              <ChevronUp size={14} />
              Score: {topPerformer.cxIndex}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card hover-scale">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Needs Improvement</p>
              <p className="text-xl font-bold">{bottomPerformer.organization}</p>
              <p className="text-sm text-gray-500">{bottomPerformer.industry}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <ChevronDown size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              Score: {bottomPerformer.cxIndex}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card hover-scale">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Most Improved</p>
              <p className="text-xl font-bold">{mostImproved.organization}</p>
              <p className="text-sm text-gray-500">{mostImproved.industry}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <LineChart size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="success" className="flex items-center gap-1">
              <ChevronUp size={14} />
              +{(mostImproved.cxIndex - mostImproved.lastYearIndex).toFixed(1)}
            </Badge>
            <span className="text-xs text-gray-500 ml-2">Year over year</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
