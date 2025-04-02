
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllData } from '@/services/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Building, TrendingUp, Star, MessageCircle, BarChart as BarChartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Performance = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      setData(mockData);
      setLoading(false);
    }, 600);
  }, []);
  
  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Loading organization data</h3>
            <p className="text-gray-500 mt-1">Please wait while we prepare AT&T insights</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Find AT&T data from the CX Index data
  const attData = data.cxIndexData.find((item: any) => 
    item.organization === "AT&T" && item.industry === "Telecom"
  );
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">AT&T</h1>
            <p className="text-gray-500 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Organization Performance Dashboard
            </p>
          </div>
        </div>
      </div>
      
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
                <TrendingUp size={14} />
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
                <p className="text-sm text-gray-500 mb-1">Industry Rank</p>
                <p className="text-3xl font-bold">{attData ? `#${attData.rank}` : 'N/A'}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <Building size={20} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-500">of {data.organizations["Telecom"].length} telecom companies</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer Sentiment</p>
                <p className="text-3xl font-bold">73.4</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                <Star size={20} />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="success" className="flex items-center gap-1">
                <TrendingUp size={14} />
                +2.1
              </Badge>
              <span className="text-xs text-gray-500 ml-2">30 day trend</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="surveys">Customer Surveys</TabsTrigger>
          <TabsTrigger value="passive">Passive Metrics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-5 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key metrics over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', cxScore: 72.1, marketShare: 35.2, customerSat: 68.3 },
                      { month: 'Feb', cxScore: 72.6, marketShare: 35.3, customerSat: 68.9 },
                      { month: 'Mar', cxScore: 73.0, marketShare: 35.5, customerSat: 69.5 },
                      { month: 'Apr', cxScore: 72.8, marketShare: 35.4, customerSat: 70.2 },
                      { month: 'May', cxScore: 73.4, marketShare: 35.7, customerSat: 71.0 },
                      { month: 'Jun', cxScore: 74.1, marketShare: 36.0, customerSat: 72.3 },
                      { month: 'Jul', cxScore: 74.5, marketShare: 36.2, customerSat: 72.8 },
                      { month: 'Aug', cxScore: 74.8, marketShare: 36.4, customerSat: 73.1 },
                      { month: 'Sep', cxScore: 75.2, marketShare: 36.5, customerSat: 73.5 },
                      { month: 'Oct', cxScore: 75.5, marketShare: 36.8, customerSat: 74.0 },
                      { month: 'Nov', cxScore: 75.9, marketShare: 37.0, customerSat: 74.6 },
                      { month: 'Dec', cxScore: 76.3, marketShare: 37.3, customerSat: 75.2 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cxScore" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="CX Score" />
                    <Line type="monotone" dataKey="marketShare" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Market Share %" />
                    <Line type="monotone" dataKey="customerSat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Customer Satisfaction" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle>CX Factor Strength</CardTitle>
                <CardDescription>AT&T performance by CX dimension</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={data.cxDimensions.map((dim: string) => ({
                        dimension: dim,
                        score: 40 + Math.random() * 45
                      }))}
                      margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="dimension" type="category" width={70} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}`, 'Score']}
                        labelFormatter={(value) => `${value} Performance`}
                      />
                      <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Competitive Comparison</CardTitle>
                <CardDescription>AT&T vs. top telecom competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Overall CX', att: 76.3, verizon: 79.1, tmobile: 77.5 },
                        { name: 'Network Reliability', att: 82.1, verizon: 85.3, tmobile: 78.9 },
                        { name: 'Customer Service', att: 71.5, verizon: 69.8, tmobile: 74.2 },
                        { name: 'Value', att: 68.7, verizon: 65.3, tmobile: 75.6 },
                        { name: 'Innovation', att: 73.9, verizon: 77.2, tmobile: 78.8 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="att" name="AT&T" fill="#4f46e5" />
                      <Bar dataKey="verizon" name="Verizon" fill="#10b981" />
                      <Bar dataKey="tmobile" name="T-Mobile" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Customer Surveys Tab */}
        <TabsContent value="surveys" className="pt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Customer Survey Analytics
              </CardTitle>
              <CardDescription>
                Analysis of customer feedback from surveys and direct responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Overall NPS</p>
                  <p className="text-3xl font-bold">+24</p>
                  <p className="text-xs text-gray-500 mt-1">+3 pts vs last quarter</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">CSAT Score</p>
                  <p className="text-3xl font-bold">3.8/5</p>
                  <p className="text-xs text-gray-500 mt-1">76% satisfaction rate</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">CES Score</p>
                  <p className="text-3xl font-bold">5.2/7</p>
                  <p className="text-xs text-gray-500 mt-1">74% effort score</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-8 mb-4">Recent Customer Feedback</h3>
              
              <div className="space-y-4">
                {data.attData.surveys.slice(0, 5).map((survey: any) => (
                  <div key={survey.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary mb-2">
                          {survey.surveyType} - {survey.channel}
                        </span>
                        <p className="text-gray-700">{survey.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">{survey.date} - {survey.region} Region</p>
                      </div>
                      <div className="bg-gray-100 px-2 py-1 rounded">
                        <span className="font-medium">{survey.score}</span>
                        <span className="text-xs text-gray-500">
                          {survey.surveyType === 'NPS' ? '/10' : 
                           survey.surveyType === 'CSAT' ? '/5' : 
                           survey.surveyType === 'CES' ? '/7' : '/100'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Survey Results by Channel</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { channel: 'Call Center', nps: 22, csat: 3.6, ces: 5.4 },
                        { channel: 'In-Store', nps: 28, csat: 4.1, ces: 4.9 },
                        { channel: 'Website', nps: 21, csat: 3.7, ces: 5.3 },
                        { channel: 'Mobile App', nps: 31, csat: 4.2, ces: 4.7 },
                        { channel: 'Chat Support', nps: 19, csat: 3.5, ces: 5.6 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="nps" name="NPS Score" fill="#4f46e5" />
                      <Bar yAxisId="left" dataKey="csat" name="CSAT Score" fill="#10b981" />
                      <Bar yAxisId="right" dataKey="ces" name="CES Score" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Passive Metrics Tab */}
        <TabsContent value="passive" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" />
                Passive Feedback Metrics
              </CardTitle>
              <CardDescription>
                Analysis of indirect customer signals from digital channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Social Media Sentiment</p>
                  <p className="text-3xl font-bold">67.8</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+2.1%</Badge>
                    <span className="text-xs text-gray-500 ml-2">30 day trend</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">App Store Rating</p>
                  <p className="text-3xl font-bold">4.1</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+0.3</Badge>
                    <span className="text-xs text-gray-500 ml-2">vs last quarter</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Website Engagement</p>
                  <p className="text-3xl font-bold">6.2m</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+4.5%</Badge>
                    <span className="text-xs text-gray-500 ml-2">monthly visitors</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Support Tickets</p>
                  <p className="text-3xl font-bold">25.3k</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="destructive" className="text-xs">+2.7%</Badge>
                    <span className="text-xs text-gray-500 ml-2">monthly volume</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 mb-6">
                <h3 className="text-lg font-medium mb-4">12-Month Passive Metrics Trends</h3>
                {data.attData.passiveMetrics.map((metric: any, index: number) => (
                  <div key={index} className="mb-8">
                    <h4 className="text-base font-medium mb-2">{metric.name}</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={metric.data}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={['auto', 'auto']} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#4f46e5" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name={metric.name}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Top Social Media Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { topic: 'Network Coverage', sentiment: 72, volume: 2450, trend: '+3.5%' },
                    { topic: 'Customer Service', sentiment: 63, volume: 1890, trend: '-1.2%' },
                    { topic: 'Billing Issues', sentiment: 54, volume: 1560, trend: '+2.7%' },
                    { topic: 'New 5G Service', sentiment: 81, volume: 1340, trend: '+8.3%' },
                    { topic: 'Mobile App', sentiment: 76, volume: 980, trend: '+5.1%' },
                    { topic: 'Pricing Plans', sentiment: 61, volume: 870, trend: '-0.8%' },
                  ].map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.topic}</p>
                        <Badge variant={parseFloat(item.trend) > 0 ? "success" : "destructive"}>
                          {item.trend}
                        </Badge>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Sentiment</p>
                          <p className="font-medium">{item.sentiment}/100</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Volume</p>
                          <p className="font-medium">{item.volume} mentions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Performance;
