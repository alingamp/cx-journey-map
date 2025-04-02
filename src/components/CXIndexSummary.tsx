
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { CXIndexData } from '@/services/mockData';

interface CXIndexSummaryProps {
  data: CXIndexData[];
  industries: string[];
  organizations?: { [key: string]: string[] };
}

const CXIndexSummary: React.FC<CXIndexSummaryProps> = ({ data, industries, organizations }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  
  // Filter data based on selected industry
  const filteredData = selectedIndustry === 'All Industries' 
    ? data 
    : data.filter(item => item.industry === selectedIndustry);
  
  // Sort by CX Index descending
  const sortedData = [...filteredData].sort((a, b) => b.cxIndex - a.cxIndex);
  
  // Get top and bottom performers
  const topPerformers = sortedData.slice(0, 5);
  const bottomPerformers = [...sortedData].sort((a, b) => a.cxIndex - b.cxIndex).slice(0, 5);
  
  // Calculate average score
  const averageScore = sortedData.reduce((sum, item) => sum + item.cxIndex, 0) / sortedData.length;
  
  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 card-header-mobile">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              CX Index Summary
            </CardTitle>
            <CardDescription className="text-sm">
              Overall performance across organizations
            </CardDescription>
          </div>
          <div className="w-full sm:w-auto">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Industries">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-5 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-600">Average CX Index</span>
            <span className="font-semibold text-base sm:text-lg">{averageScore.toFixed(1)}</span>
          </div>
          <Progress value={averageScore} className="h-2" />
        </div>
        
        {/* Top performers */}
        <div className="mb-5 sm:mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-600">Top Performers</h3>
          <div className="space-y-2 sm:space-y-3">
            {topPerformers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-1 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium text-xs sm:text-sm min-w-[15px]">{index + 1}</span>
                  <div>
                    <p className="font-medium text-xs sm:text-sm">{item.organization}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{item.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isImproving ? "success" : "destructive"} className="rounded-md font-normal text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2">
                    {item.isImproving ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {item.cxIndex > item.lastYearIndex 
                      ? `+${(item.cxIndex - item.lastYearIndex).toFixed(1)}` 
                      : (item.cxIndex - item.lastYearIndex).toFixed(1)}
                  </Badge>
                  <span className="font-semibold text-xs sm:text-sm">{item.cxIndex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom performers */}
        <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-600">Needs Improvement</h3>
          <div className="space-y-2 sm:space-y-3">
            {bottomPerformers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-1 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium text-xs sm:text-sm min-w-[15px]">{sortedData.length - index}</span>
                  <div>
                    <p className="font-medium text-xs sm:text-sm">{item.organization}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{item.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isImproving ? "success" : "destructive"} className="rounded-md font-normal text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2">
                    {item.isImproving ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {item.cxIndex > item.lastYearIndex 
                      ? `+${(item.cxIndex - item.lastYearIndex).toFixed(1)}` 
                      : (item.cxIndex - item.lastYearIndex).toFixed(1)}
                  </Badge>
                  <span className="font-semibold text-xs sm:text-sm">{item.cxIndex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CXIndexSummary;
