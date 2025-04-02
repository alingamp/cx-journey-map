
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllData } from '@/services/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Building, TrendingUp, BarChart as BarChartIcon, MessageCircle, Activity, LineChart as LineChartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Performance = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrg, setSelectedOrg] = useState<string>("AT&T");
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      setData(mockData);
      setLoading(false);
    }, 600);
  }, []);
  
  const handleOrgChange = (value: string) => {
    // Only for display purposes - don't actually change the organization
    if (value !== "AT&T") {
      toast.info("This is a demo focusing on AT&T data only");
      return;
    }
    setSelectedOrg(value);
  };
  
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
  
  // Performance trend data over time
  const performanceTrendData = [
    { month: 'Jan', cxIndex: 72.1, directFeedback: 68.3, passiveMetrics: 65.7 },
    { month: 'Feb', cxIndex: 72.6, directFeedback: 68.9, passiveMetrics: 66.2 },
    { month: 'Mar', cxIndex: 73.0, directFeedback: 69.5, passiveMetrics: 67.1 },
    { month: 'Apr', cxIndex: 72.8, directFeedback: 70.2, passiveMetrics: 66.8 },
    { month: 'May', cxIndex: 73.4, directFeedback: 71.0, passiveMetrics: 68.5 },
    { month: 'Jun', cxIndex: 74.1, directFeedback: 72.3, passiveMetrics: 69.7 },
    { month: 'Jul', cxIndex: 74.5, directFeedback: 72.8, passiveMetrics: 70.4 },
    { month: 'Aug', cxIndex: 74.8, directFeedback: 73.1, passiveMetrics: 71.3 },
    { month: 'Sep', cxIndex: 75.2, directFeedback: 73.5, passiveMetrics: 71.8 },
    { month: 'Oct', cxIndex: 75.5, directFeedback: 74.0, passiveMetrics: 72.5 },
    { month: 'Nov', cxIndex: 75.9, directFeedback: 74.6, passiveMetrics: 73.2 },
    { month: 'Dec', cxIndex: 76.3, directFeedback: 75.2, passiveMetrics: 74.0 },
  ];
  
  // Passive metrics data
  const passiveMetricsData = [
    { month: 'Jan', xSentiment: 62.3, newsSentiment: 65.8, googleTrends: 59.7 },
    { month: 'Feb', xSentiment: 63.1, newsSentiment: 64.9, googleTrends: 60.2 },
    { month: 'Mar', xSentiment: 64.5, newsSentiment: 63.7, googleTrends: 62.8 },
    { month: 'Apr', xSentiment: 63.8, newsSentiment: 64.5, googleTrends: 64.1 },
    { month: 'May', xSentiment: 65.2, newsSentiment: 66.1, googleTrends: 65.3 },
    { month: 'Jun', xSentiment: 66.7, newsSentiment: 67.8, googleTrends: 67.2 },
    { month: 'Jul', xSentiment: 68.3, newsSentiment: 68.5, googleTrends: 68.8 },
    { month: 'Aug', xSentiment: 69.5, newsSentiment: 67.3, googleTrends: 69.1 },
    { month: 'Sep', xSentiment: 70.2, newsSentiment: 68.4, googleTrends: 70.5 },
    { month: 'Oct', xSentiment: 71.8, newsSentiment: 69.1, googleTrends: 71.2 },
    { month: 'Nov', xSentiment: 72.5, newsSentiment: 70.3, googleTrends: 72.7 },
    { month: 'Dec', xSentiment: 73.1, newsSentiment: 71.5, googleTrends: 74.2 },
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight animate-fade-in">Organization Performance Dashboard</h1>
              <p className="text-gray-500 animate-fade-in" style={{ animationDelay: '100ms' }}>
                View detailed performance metrics and analytics
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <Select value={selectedOrg} onValueChange={handleOrgChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                {data.organizations["Telecom"].map((org: string) => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <p className="text-sm text-gray-500 mb-1">Direct Feedback Score</p>
                <p className="text-3xl font-bold">74.5</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <MessageCircle size={20} />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="success" className="flex items-center gap-1">
                <TrendingUp size={14} />
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
                <TrendingUp size={14} />
                +2.8
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
                    data={performanceTrendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cxIndex" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="CX Index" />
                    <Line type="monotone" dataKey="directFeedback" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Direct Feedback" />
                    <Line type="monotone" dataKey="passiveMetrics" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Passive Metrics" />
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
                {data.attData?.surveys.slice(0, 5).map((survey: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
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
                <Activity className="h-5 w-5 text-primary" />
                Passive Feedback Metrics
              </CardTitle>
              <CardDescription>
                Analysis of indirect customer sentiment from digital channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">X (Twitter) Sentiment</p>
                  <p className="text-3xl font-bold">73.1</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+3.8%</Badge>
                    <span className="text-xs text-gray-500 ml-2">30 day trend</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Based on 28.7K mentions analyzing customer experience themes</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">News Reports Sentiment</p>
                  <p className="text-3xl font-bold">71.5</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+1.2%</Badge>
                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Analysis of 125 news articles covering AT&T's customer experience</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Google Trends Sentiment</p>
                  <p className="text-3xl font-bold">74.2</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+5.5%</Badge>
                    <span className="text-xs text-gray-500 ml-2">vs last quarter</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Based on search volume and tone analysis for AT&T related queries</p>
                </div>
              </div>
              
              <div className="mt-8 mb-6">
                <h3 className="text-lg font-medium mb-4">Passive Metrics Trends (12-Month)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={passiveMetricsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[55, 80]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="xSentiment" 
                        stroke="#1DA1F2" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="X Sentiment"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="newsSentiment" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="News Reports"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="googleTrends" 
                        stroke="#4285F4" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Google Trends"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Top Topics from Passive Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { topic: '5G Network Expansion', sentiment: 82, volume: 2450, trend: '+7.3%' },
                    { topic: 'Customer Service Wait Times', sentiment: 63, volume: 1890, trend: '-1.2%' },
                    { topic: 'Mobile App Experience', sentiment: 76, volume: 1560, trend: '+4.6%' },
                    { topic: 'Billing Transparency', sentiment: 65, volume: 1340, trend: '+2.1%' },
                    { topic: 'Network Reliability', sentiment: 79, volume: 1280, trend: '+5.4%' },
                    { topic: 'Streaming Services', sentiment: 74, volume: 870, trend: '+3.8%' },
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
