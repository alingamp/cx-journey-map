
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CXIndexData {
  industry: string;
  organization: string;
  cxIndex: number;
  rank: number;
  lastYearIndex: number;
  isImproving: boolean;
}

interface CXIndexSummaryProps {
  data: CXIndexData[];
  industries: string[];
}

const CXIndexSummary: React.FC<CXIndexSummaryProps> = ({ data, industries }) => {
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
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              CX Index Summary
            </CardTitle>
            <CardDescription>
              Overall performance across organizations
            </CardDescription>
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]">
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
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Average CX Index</span>
            <span className="font-semibold text-lg">{averageScore.toFixed(1)}</span>
          </div>
          <Progress value={averageScore} className="h-2" />
        </div>
        
        {/* Top performers */}
        <div className="mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-medium mb-3 text-gray-600">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{index + 1}</span>
                  <div>
                    <p className="font-medium">{item.organization}</p>
                    <p className="text-xs text-gray-500">{item.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isImproving ? "success" : "destructive"} className="rounded-md font-normal">
                    {item.isImproving ? (
                      <TrendingUp size={14} className="mr-1" />
                    ) : (
                      <TrendingDown size={14} className="mr-1" />
                    )}
                    {item.cxIndex > item.lastYearIndex 
                      ? `+${(item.cxIndex - item.lastYearIndex).toFixed(1)}` 
                      : (item.cxIndex - item.lastYearIndex).toFixed(1)}
                  </Badge>
                  <span className="font-semibold">{item.cxIndex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom performers */}
        <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-medium mb-3 text-gray-600">Needs Improvement</h3>
          <div className="space-y-3">
            {bottomPerformers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{sortedData.length - index}</span>
                  <div>
                    <p className="font-medium">{item.organization}</p>
                    <p className="text-xs text-gray-500">{item.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isImproving ? "success" : "destructive"} className="rounded-md font-normal">
                    {item.isImproving ? (
                      <TrendingUp size={14} className="mr-1" />
                    ) : (
                      <TrendingDown size={14} className="mr-1" />
                    )}
                    {item.cxIndex > item.lastYearIndex 
                      ? `+${(item.cxIndex - item.lastYearIndex).toFixed(1)}` 
                      : (item.cxIndex - item.lastYearIndex).toFixed(1)}
                  </Badge>
                  <span className="font-semibold">{item.cxIndex}</span>
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
