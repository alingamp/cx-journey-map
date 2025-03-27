
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, PieChart, LineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';

interface Scenario {
  name: string;
  cxImprovement: number;
  revenuePct: number;
  marginPct: number;
  retentionPct: number;
}

interface FinancialData {
  industry: string;
  organization: string;
  currentCXIndex: number;
  scenarios: Scenario[];
}

interface FinancialImpactProps {
  data: FinancialData[];
  industries?: string[];
  organizations: { [key: string]: string[] } | any;
  selectedIndustry?: string;
}

const FinancialImpact: React.FC<FinancialImpactProps> = ({ data, industries, organizations, selectedIndustry }) => {
  const [localSelectedIndustry, setLocalSelectedIndustry] = useState<string>(selectedIndustry || '');
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Update local state when prop changes
  useEffect(() => {
    if (selectedIndustry) {
      setLocalSelectedIndustry(selectedIndustry);
    }
  }, [selectedIndustry]);
  
  useEffect(() => {
    if (organizations[localSelectedIndustry] && organizations[localSelectedIndustry].length > 0) {
      setSelectedOrg(organizations[localSelectedIndustry][0]);
    }
  }, [localSelectedIndustry, organizations]);
  
  useEffect(() => {
    if (!selectedOrg) return;
    
    const orgData = data.find(item => 
      item.industry === localSelectedIndustry && 
      item.organization === selectedOrg
    );
    
    if (orgData) {
      const metricKey = selectedMetric === 'revenue' 
        ? 'revenuePct' 
        : selectedMetric === 'margin' 
          ? 'marginPct' 
          : 'retentionPct';
      
      const formattedData = orgData.scenarios.map(scenario => ({
        name: scenario.name,
        value: scenario[metricKey],
        cxImprovement: scenario.cxImprovement,
        fill: scenario.name === 'Current Trajectory' 
          ? '#94a3b8' 
          : scenario.name === 'Moderate Improvement' 
            ? '#6366f1' 
            : '#4f46e5'
      }));
      
      setChartData(formattedData);
    }
  }, [localSelectedIndustry, selectedOrg, selectedMetric, data]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-xs">
          <p className="font-medium mb-1">{data.name}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <p>CX Improvement:</p>
            <p className="font-medium">{data.cxImprovement > 0 ? `+${data.cxImprovement}` : data.cxImprovement} points</p>
            <p>{getMetricLabel()}:</p>
            <p className="font-medium">{data.value > 0 ? `+${data.value}%` : `${data.value}%`}</p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue': return 'Revenue Growth';
      case 'margin': return 'Margin Improvement';
      case 'retention': return 'Retention Increase';
      default: return 'Value';
    }
  };
  
  return (
    <Card className="glass-card animate-scale-in h-full">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <DollarSign size={20} className="text-primary" />
            Financial Impact Analysis
          </CardTitle>
          <CardDescription>
            Projected outcomes from CX improvements
          </CardDescription>
        </div>
        <div className="flex mt-2 gap-2">
          {!selectedIndustry && industries && (
            <Select value={localSelectedIndustry} onValueChange={setLocalSelectedIndustry}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries?.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={!localSelectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {localSelectedIndustry && organizations[localSelectedIndustry]?.map((org) => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="mb-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
            <TabsTrigger value="margin" className="text-xs">Margin</TabsTrigger>
            <TabsTrigger value="retention" className="text-xs">Retention</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="h-[280px] animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}%`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#000" />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 p-3 bg-gray-50 rounded-lg animate-slide-up">
          <h4 className="font-medium text-sm mb-1">Projected Impact:</h4>
          {chartData.length > 0 && (
            <ul className="text-xs space-y-1 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-indigo-600"></span>
                <span>
                  <strong>Significant Improvement Scenario:</strong> A 10-point CX increase could yield 
                  {selectedMetric === 'revenue' 
                    ? ` ${chartData[2]?.value}% revenue growth` 
                    : selectedMetric === 'margin' 
                      ? ` ${chartData[2]?.value}% margin improvement` 
                      : ` ${chartData[2]?.value}% retention increase`}
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-purple-500"></span>
                <span>
                  <strong>Key Driver:</strong> {selectedMetric === 'revenue' 
                    ? 'Improved brand perception and customer advocacy'
                    : selectedMetric === 'margin' 
                      ? 'Reduced service costs and operational efficiencies'
                      : 'Increased loyalty and reduced churn'
                  }
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                <span>
                  <strong>ROI Timeline:</strong> Initial returns visible within 6-12 months
                </span>
              </li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialImpact;
