
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import { getAllData, generateCompetitiveLandscape } from '@/services/mockData';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TelecomCompaniesSummary from '@/components/dashboard/TelecomCompaniesSummary';
import ComparisonGraphs from '@/components/dashboard/ComparisonGraphs';

const IndustryDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("Telecom");
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockData = getAllData();
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);
  
  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Loading dashboard data</h3>
            <p className="text-gray-500 mt-1">Please wait while we prepare your insights</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Generate competitive landscape data for the selected industry
  const competitiveLandscape = generateCompetitiveLandscape(selectedIndustry);
  
  // Calculate summary data for the cards
  const cxIndexData = data.cxIndexData.filter((item: any) => item.industry === selectedIndustry);
  const avgCXScore = parseFloat((cxIndexData.reduce((acc: number, item: any) => acc + item.cxIndex, 0) / cxIndexData.length).toFixed(1));
  
  // Find top performer
  const topPerformer = [...cxIndexData].sort((a: any, b: any) => b.cxIndex - a.cxIndex)[0];
  
  // Find bottom performer
  const bottomPerformer = [...cxIndexData].sort((a: any, b: any) => a.cxIndex - b.cxIndex)[0];
  
  // Find most improved
  const mostImproved = [...cxIndexData].sort((a: any, b: any) => 
    (a.cxIndex - a.lastYearIndex) - (b.cxIndex - b.lastYearIndex)
  ).reverse()[0];
  
  // Get telecom-specific companies and their metrics
  const telecomCompanies = data.organizations["Telecom"] || [];
  const telecomMetrics = telecomCompanies.map((company: string) => {
    // Find CX index data for this company
    const cxData = data.cxIndexData.find((item: any) => 
      item.organization === company && item.industry === "Telecom"
    );
    
    // Generate mock direct feedback and passive metrics scores
    const directFeedbackScore = 65 + Math.floor(Math.random() * 25);
    const passiveMetricsScore = 60 + Math.floor(Math.random() * 30);
    
    return {
      organization: company,
      cxIndex: cxData ? cxData.cxIndex : 'N/A',
      directFeedback: directFeedbackScore,
      passiveMetrics: passiveMetricsScore,
      trend: cxData ? (cxData.cxIndex > cxData.lastYearIndex ? 'up' : 'down') : 'neutral'
    };
  }).sort((a, b) => {
    if (typeof a.cxIndex === 'number' && typeof b.cxIndex === 'number') {
      return b.cxIndex - a.cxIndex;
    }
    return 0;
  });
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Industry Dashboard</h1>
        <p className="text-gray-500 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Comprehensive industry analysis and competitive insights
        </p>
      </div>
      
      {/* Summary Cards Section - Moved to the top */}
      <SummaryCards
        avgCXScore={avgCXScore}
        topPerformer={topPerformer}
        bottomPerformer={bottomPerformer}
        mostImproved={mostImproved}
      />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Industry Analysis
          </h2>
          <p className="text-muted-foreground">
            Analyze industry competition, CX trends, and factor importance
          </p>
        </div>
        
        <div className="w-full lg:w-72">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {data.industries.map((industry: string) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Telecom Companies Summary Section - Only shown when Telecom is selected */}
      {selectedIndustry === "Telecom" && (
        <TelecomCompaniesSummary telecomMetrics={telecomMetrics} />
      )}
      
      {/* Comparison Graphs */}
      <div className="space-y-6 mb-6">
        <ComparisonGraphs data={telecomMetrics} />
      </div>
    </DashboardLayout>
  );
};

export default IndustryDashboard;
