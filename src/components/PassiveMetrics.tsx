
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart4, Star, Clock, Activity, Users, Phone } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PassiveData {
  industry: string;
  organization: string;
  engagementIndex: number;
  webTraffic: number;
  socialMediaFollowers: number;
  reviewScore: number;
  reviewCount: number;
  storeVisits: number | null;
  customerCalls: number;
  timeOnSite: number;
}

interface PassiveMetricsProps {
  data: PassiveData[];
  industries: string[];
  organizations: { [key: string]: string[] };
}

const PassiveMetrics: React.FC<PassiveMetricsProps> = ({ data, industries, organizations }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industries[0]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [orgData, setOrgData] = useState<PassiveData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Set the first organization when industry changes
  useEffect(() => {
    if (organizations[selectedIndustry] && organizations[selectedIndustry].length > 0) {
      setSelectedOrg(organizations[selectedIndustry][0]);
    }
  }, [selectedIndustry, organizations]);
  
  // Update data when selection changes
  useEffect(() => {
    if (!selectedOrg) return;
    
    // Find data for selected organization
    const selectedData = data.find(item => 
      item.industry === selectedIndustry && 
      item.organization === selectedOrg
    );
    
    if (selectedData) {
      setOrgData(selectedData);
      
      // Normalize data for radar chart
      setChartData([
        { metric: 'Web Traffic', value: Math.min(100, (selectedData.webTraffic / 2000000) * 100) },
        { metric: 'Social Media', value: Math.min(100, (selectedData.socialMediaFollowers / 1000000) * 100) },
        { metric: 'Reviews', value: (selectedData.reviewScore / 5) * 100 },
        { metric: 'Time on Site', value: Math.min(100, (selectedData.timeOnSite / 8) * 100) },
        { metric: 'Customer Calls', value: Math.min(100, (selectedData.customerCalls / 300000) * 100) },
      ]);
    }
  }, [selectedIndustry, selectedOrg, data]);
  
  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Passive Metrics Visualization
          </CardTitle>
          <CardDescription>
            Engagement index from combined passive metrics
          </CardDescription>
        </div>
        <div className="flex mt-2 gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={!selectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {selectedIndustry && organizations[selectedIndustry]?.map((org) => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-4">
          {orgData && (
            <div className="grid grid-cols-2 gap-3 animate-slide-in">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Engagement Index</p>
                <p className="text-2xl font-semibold">{orgData.engagementIndex.toFixed(1)}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <Star className="text-amber-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Review Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-semibold">{orgData.reviewScore.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">({formatNumber(orgData.reviewCount)} reviews)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <Users className="text-blue-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Social Media</p>
                  <p className="text-lg font-semibold">{formatNumber(orgData.socialMediaFollowers)}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <Clock className="text-purple-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Avg. Time on Site</p>
                  <p className="text-lg font-semibold">{orgData.timeOnSite.toFixed(1)} min</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <Activity className="text-emerald-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Web Traffic</p>
                  <p className="text-lg font-semibold">{formatNumber(orgData.webTraffic)}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <Phone className="text-rose-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Customer Calls</p>
                  <p className="text-lg font-semibold">{formatNumber(orgData.customerCalls)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-[200px] animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Engagement"
                dataKey="value"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.2}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(0)}%`, 'Relative Score']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassiveMetrics;
