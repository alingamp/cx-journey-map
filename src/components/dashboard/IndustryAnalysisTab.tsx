
import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import IndustryOverview from './IndustryOverview';
import IndustryStatCards from './IndustryStatCards';
import IndustryCharts from './IndustryCharts';
import IndustryFactors from './IndustryFactors';

interface IndustryAnalysisTabProps {
  data: any;
  competitiveLandscape: any[];
}

const IndustryAnalysisTab: React.FC<IndustryAnalysisTabProps> = ({ data, competitiveLandscape }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(data.industries[0]);
  const [industryTab, setIndustryTab] = useState<string>('overview');
  const [historicalDataReady, setHistoricalDataReady] = useState<boolean>(false);

  // Calculate industry metrics for selected industry
  const cxIndexTrend = data.industries.map((industry: string) => {
    const industryData = data.cxIndexData.filter((item: any) => item.industry === industry);
    const average = parseFloat((industryData.reduce((acc: number, item: any) => acc + item.cxIndex, 0) / industryData.length).toFixed(1));
    const lastYearAverage = parseFloat((industryData.reduce((acc: number, item: any) => acc + item.lastYearIndex, 0) / industryData.length).toFixed(1));
    const change = parseFloat((average - lastYearAverage).toFixed(1));
    const percentChange = parseFloat(((change / lastYearAverage) * 100).toFixed(1));
    
    return {
      industry,
      currentYear: average,
      lastYear: lastYearAverage,
      change,
      percentChange,
      isImproving: change > 0
    };
  });
  
  const selectedIndustryTrend = cxIndexTrend.find(item => item.industry === selectedIndustry) || null;

  // Generate mock historical data if not present
  useEffect(() => {
    if (!data.industryHistoricalData) {
      // Create sample historical data for each industry
      const histData = data.industries.map((industry: string) => {
        const years = ['2019', '2020', '2021', '2022', '2023'];
        const metrics = ['Revenue', 'Customer Satisfaction', 'Market Share'];
        
        return {
          industry,
          years,
          datasets: metrics.map(metric => ({
            name: metric,
            data: years.map(() => Math.floor(Math.random() * 50) + 50) // Random data between 50-100
          }))
        };
      });
      
      // Add the data to the main data object
      data.industryHistoricalData = histData;
      setHistoricalDataReady(true);
    } else {
      setHistoricalDataReady(true);
    }
  }, [data]);

  return (
    <div className="pt-4 mt-0 animate-fade-in">
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

      <Tabs value={industryTab} onValueChange={setIndustryTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Industry Overview</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="factors">CX Factors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {historicalDataReady && (
            <IndustryOverview 
              data={data.industryHistoricalData} 
              selectedIndustry={selectedIndustry} 
            />
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <IndustryStatCards selectedIndustryTrend={selectedIndustryTrend} />
          <IndustryCharts 
            competitiveLandscape={competitiveLandscape} 
            selectedIndustry={selectedIndustry} 
          />
        </TabsContent>

        {/* CX Factors Tab */}
        <TabsContent value="factors">
          <IndustryFactors data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndustryAnalysisTab;
