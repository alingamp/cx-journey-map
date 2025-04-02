
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PassiveMetricsTabProps {
  passiveMetricsData: any[];
}

const PassiveMetricsTab: React.FC<PassiveMetricsTabProps> = ({ passiveMetricsData }) => {
  return (
    <div className="pt-4">
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
    </div>
  );
};

export default PassiveMetricsTab;
