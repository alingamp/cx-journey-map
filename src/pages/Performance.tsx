
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, BarChart4, Activity, Target, Check, AlertCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import CXIndexSummary from '@/components/CXIndexSummary';
import FinancialImpact from '@/components/FinancialImpact';
import { getAllData } from '@/services/mockData';

const Performance = () => {
  const data = getAllData();
  const [selectedIndustry, setSelectedIndustry] = useState(data.industries[0]);
  
  // Filter organizations for the selected industry
  const filteredOrgs = data.cxIndexData
    .filter(item => item.industry === selectedIndustry)
    .sort((a, b) => b.cxIndex - a.cxIndex);
  
  // Get financial impact data for this industry
  const financialData = data.financialImpact
    .filter(item => item.industry === selectedIndustry);
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Performance
            </h1>
            <p className="text-muted-foreground">
              Track CX performance metrics and financial impact
            </p>
          </div>
          
          <div className="w-full lg:w-72">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {data.industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Industry Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {parseFloat((filteredOrgs.reduce((acc, item) => acc + item.cxIndex, 0) / filteredOrgs.length).toFixed(1))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average CX Index Score
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {filteredOrgs[0]?.cxIndex || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredOrgs[0]?.organization || 'N/A'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bottom Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {filteredOrgs[filteredOrgs.length - 1]?.cxIndex || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredOrgs[filteredOrgs.length - 1]?.organization || 'N/A'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Performance Gap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {filteredOrgs.length > 1 
                  ? parseFloat((filteredOrgs[0].cxIndex - filteredOrgs[filteredOrgs.length - 1].cxIndex).toFixed(1))
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Between top and bottom performers
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rankings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="trends">YoY Trends</TabsTrigger>
            <TabsTrigger value="financial">Financial Impact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rankings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Rankings</CardTitle>
                <CardDescription>
                  CX Performance ranking for {selectedIndustry} organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={filteredOrgs}
                      margin={{
                        top: 5, right: 30, left: 80, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[50, 100]} />
                      <YAxis 
                        dataKey="organization" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}`, 'CX Index']}
                      />
                      <Bar dataKey="cxIndex" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="cxIndex" position="right" formatter={(v: number) => v.toFixed(1)} />
                        {filteredOrgs.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? '#10b981' : index === filteredOrgs.length - 1 ? '#ef4444' : '#3b82f6'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Performance</CardTitle>
                <CardDescription>
                  Change in CX Index from last year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={filteredOrgs.map(org => ({
                        ...org,
                        change: parseFloat((org.cxIndex - org.lastYearIndex).toFixed(1))
                      }))}
                      margin={{
                        top: 5, right: 30, left: 80, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis 
                        type="number" 
                        domain={[-10, 10]} 
                        tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}`}
                      />
                      <YAxis 
                        dataKey="organization" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Change']}
                      />
                      <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="change" position="right" formatter={(v: number) => `${v > 0 ? '+' : ''}${v}`} />
                        {filteredOrgs.map((entry, index) => {
                          const change = entry.cxIndex - entry.lastYearIndex;
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={change > 0 ? '#10b981' : '#ef4444'} 
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-4">
            <FinancialImpact 
              data={financialData}
              selectedIndustry={selectedIndustry}
              organizations={data.organizations[selectedIndustry] || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Performance;
