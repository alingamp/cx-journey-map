
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, BarChartIcon, MessageCircle, Activity } from 'lucide-react';

interface PerformanceSummaryCardsProps {
  attData: any;
}

const PerformanceSummaryCards: React.FC<PerformanceSummaryCardsProps> = ({ attData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">CX Index</p>
              <p className="text-3xl font-bold">{attData ? attData.cxIndex.toFixed(1) : 'N/A'}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <BarChartIcon size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant={attData && attData.isImproving ? "success" : "destructive"} className="flex items-center gap-1">
              <ChevronUp size={14} />
              {attData ? (attData.cxIndex - attData.lastYearIndex).toFixed(1) : 'N/A'}
            </Badge>
            <span className="text-xs text-gray-500 ml-2">vs. last year</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Direct Feedback Score</p>
              <p className="text-3xl font-bold">74.5</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <MessageCircle size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="success" className="flex items-center gap-1">
              <ChevronUp size={14} />
              +3.2
            </Badge>
            <span className="text-xs text-gray-500 ml-2">30 day trend</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Passive Metrics Score</p>
              <p className="text-3xl font-bold">72.9</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full text-amber-600">
              <Activity size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="success" className="flex items-center gap-1">
              <ChevronUp size={14} />
              +2.8
            </Badge>
            <span className="text-xs text-gray-500 ml-2">30 day trend</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSummaryCards;
