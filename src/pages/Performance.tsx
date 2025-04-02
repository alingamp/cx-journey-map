
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllData } from '@/services/mockData';
import { getCustomerSurveys, CustomerSurvey } from '@/services/customerSurveyData';
import SurveyDetailDialog from '@/components/SurveyDetailDialog';
import PerformanceHeader from '@/components/performance/PerformanceHeader';
import PerformanceSummaryCards from '@/components/performance/PerformanceSummaryCards';
import PerformanceOverviewTab from '@/components/performance/PerformanceOverviewTab';
import CustomerSurveysTab from '@/components/performance/CustomerSurveysTab';
import PassiveMetricsTab from '@/components/performance/PassiveMetricsTab';

const Performance = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrg, setSelectedOrg] = useState<string>("AT&T");
  const [surveys, setSurveys] = useState<CustomerSurvey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<CustomerSurvey | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      setData(mockData);
      
      // Load survey data
      const surveyData = getCustomerSurveys(mockData.industries, mockData.organizations);
      // Filter to only AT&T surveys for this demo, but get more of them
      const attSurveys = surveyData.filter(survey => survey.organization === "AT&T");
      setSurveys(attSurveys);
      
      setLoading(false);
    }, 600);
  }, []);
  
  const handleOrgChange = (value: string) => {
    setSelectedOrg(value);
  };
  
  const handleViewSurvey = (survey: CustomerSurvey) => {
    setSelectedSurvey(survey);
    setDialogOpen(true);
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
  
  // Survey dimension data
  const surveyDimensionsData = [
    { dimension: 'Efficiency', score: 7.8 },
    { dimension: 'Confidence', score: 8.2 },
    { dimension: 'Autonomy', score: 6.9 },
    { dimension: 'Resolution', score: 7.5 },
    { dimension: 'Enjoyment', score: 6.7 },
    { dimension: 'Beauty', score: 7.3 },
    { dimension: 'Connection', score: 6.5 },
  ].sort((a, b) => b.score - a.score);
  
  return (
    <DashboardLayout>
      <PerformanceHeader 
        selectedOrg={selectedOrg} 
        handleOrgChange={handleOrgChange} 
        organizations={data.organizations["Telecom"]} 
      />
      
      <PerformanceSummaryCards attData={attData} />
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="surveys">Customer Surveys</TabsTrigger>
          <TabsTrigger value="passive">Passive Metrics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <PerformanceOverviewTab 
            performanceTrendData={performanceTrendData} 
            cxDimensions={data.cxDimensions}
          />
        </TabsContent>
        
        {/* Customer Surveys Tab */}
        <TabsContent value="surveys">
          <CustomerSurveysTab 
            surveys={surveys} 
            surveyDimensionsData={surveyDimensionsData} 
            onViewSurvey={handleViewSurvey} 
          />
        </TabsContent>
        
        {/* Passive Metrics Tab */}
        <TabsContent value="passive">
          <PassiveMetricsTab passiveMetricsData={passiveMetricsData} />
        </TabsContent>
      </Tabs>
      
      {/* Survey Detail Dialog */}
      <SurveyDetailDialog
        survey={selectedSurvey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Performance;
