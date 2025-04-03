
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageCircle, Users, BarChart, PieChart, Info, ArrowUp, ArrowDown, CircleCheck, CircleX } from 'lucide-react';
import SurveyResponseTable from '@/components/SurveyResponseTable';
import { CustomerSurvey } from '@/services/customerSurveyData';
import SpiderDimensionsChart from '@/components/SpiderDimensionsChart';
import DimensionComparisonTable from '@/components/DimensionComparisonTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';

interface CustomerSurveysTabProps {
  surveys: CustomerSurvey[];
  surveyDimensionsData: any[];
  onViewSurvey: (survey: CustomerSurvey) => void;
}

const CustomerSurveysTab: React.FC<CustomerSurveysTabProps> = ({ 
  surveys, 
  surveyDimensionsData, 
  onViewSurvey 
}) => {
  const isMobile = useIsMobile();
  const [showCompetitors, setShowCompetitors] = React.useState(false);
  const [filteredSurveys, setFilteredSurveys] = React.useState<CustomerSurvey[]>(surveys);
  
  // Function to update filtered surveys (used by SurveyResponseTable)
  const updateFilteredSurveys = (newFilteredSurveys: CustomerSurvey[]) => {
    setFilteredSurveys(newFilteredSurveys);
  };
  
  // Data for the spider chart
  const spiderData = [
    { dimension: "Efficiency", ATT: 7.8, Verizon: 7.1, TMobile: 6.9, fullName: "The fastest and easiest way to complete my task" },
    { dimension: "Fun", ATT: 6.7, Verizon: 6.3, TMobile: 7.2, fullName: "A fun or enjoyable experience" },
    { dimension: "Control", ATT: 7.5, Verizon: 7.7, TMobile: 6.9, fullName: "Control over my situation and choices" },
    { dimension: "Clarity", ATT: 8.2, Verizon: 7.6, TMobile: 7.0, fullName: "Clear and understandable information or assistance" },
    { dimension: "Learning", ATT: 7.1, Verizon: 6.8, TMobile: 6.5, fullName: "Gathering additional information or learning something new" },
    { dimension: "Autonomy", ATT: 6.9, Verizon: 7.2, TMobile: 6.7, fullName: "Getting exactly what I want" },
  ];
  
  // Data for the comparison table with competitor data added
  const comparisonData = [
    { dimension: "Efficiency", industry: 7.3, att: 7.8, delta: 0.5, Verizon: 7.1, TMobile: 6.9, fullName: "The fastest and easiest way to complete my task" },
    { dimension: "Fun", industry: 6.9, att: 6.7, delta: -0.2, Verizon: 6.3, TMobile: 7.2, fullName: "A fun or enjoyable experience" },
    { dimension: "Control", industry: 7.2, att: 7.5, delta: 0.3, Verizon: 7.7, TMobile: 6.9, fullName: "Control over my situation and choices" },
    { dimension: "Clarity", industry: 7.5, att: 8.2, delta: 0.7, Verizon: 7.6, TMobile: 7.0, fullName: "Clear and understandable information or assistance" },
    { dimension: "Learning", industry: 7.3, att: 7.1, delta: -0.2, Verizon: 6.8, TMobile: 6.5, fullName: "Gathering additional information or learning something new" },
    { dimension: "Autonomy", industry: 7.1, att: 6.9, delta: -0.2, Verizon: 7.2, TMobile: 6.7, fullName: "Getting exactly what I want" },
  ];

  // Handler for the competitor toggle from SpiderDimensionsChart
  const handleToggleCompetitors = (isPressed: boolean) => {
    setShowCompetitors(isPressed);
  };
  
  // Calculate summary metrics from filtered surveys
  const calculateSummaryMetrics = () => {
    if (!filteredSurveys.length) return null;
    
    // Demographics
    const genderCounts: Record<string, number> = {};
    const ageGroups: Record<string, number> = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
    const incomeCounts: Record<string, number> = {};
    
    // Experience types
    const experienceTypes: Record<string, number> = {};
    
    // Channels
    const channels: Record<string, number> = {};
    
    // Expectations
    let totalIngoing = 0;
    let totalOutgoing = 0;
    let exceededCount = 0;
    let metCount = 0;
    let belowCount = 0;
    
    // Desired elements
    const desiredElements: Record<string, number> = {};
    
    // Process each survey
    filteredSurveys.forEach(survey => {
      // Demographics
      genderCounts[survey.demographics.gender] = (genderCounts[survey.demographics.gender] || 0) + 1;
      
      // Age groups
      const age = survey.demographics.age;
      if (age <= 25) ageGroups['18-25']++;
      else if (age <= 35) ageGroups['26-35']++;
      else if (age <= 45) ageGroups['36-45']++;
      else if (age <= 55) ageGroups['46-55']++;
      else ageGroups['56+']++;
      
      // Income
      incomeCounts[survey.demographics.income] = (incomeCounts[survey.demographics.income] || 0) + 1;
      
      // Experience types
      experienceTypes[survey.experience.type] = (experienceTypes[survey.experience.type] || 0) + 1;
      
      // Channels
      channels[survey.experience.channel] = (channels[survey.experience.channel] || 0) + 1;
      
      // Expectations
      totalIngoing += survey.experience.ingoingExpectation;
      totalOutgoing += survey.impact.outgoingExpectation;
      
      if (survey.impact.outgoingExpectation > survey.experience.ingoingExpectation) {
        exceededCount++;
      } else if (survey.impact.outgoingExpectation === survey.experience.ingoingExpectation) {
        metCount++;
      } else {
        belowCount++;
      }
      
      // Desired elements
      survey.experience.desiredElements.forEach(element => {
        desiredElements[element] = (desiredElements[element] || 0) + 1;
      });
    });
    
    // Calculate top values
    const topGender = Object.entries(genderCounts).sort((a, b) => b[1] - a[1])[0];
    const topAgeGroup = Object.entries(ageGroups).sort((a, b) => b[1] - a[1])[0];
    const topExperienceType = Object.entries(experienceTypes).sort((a, b) => b[1] - a[1])[0];
    const topChannel = Object.entries(channels).sort((a, b) => b[1] - a[1])[0];
    const topDesiredElement = Object.entries(desiredElements).sort((a, b) => b[1] - a[1])[0];
    
    // Calculate averages
    const avgIngoing = totalIngoing / filteredSurveys.length;
    const avgOutgoing = totalOutgoing / filteredSurveys.length;
    const expectationDelta = avgOutgoing - avgIngoing;
    
    return {
      totalSurveys: filteredSurveys.length,
      demographics: {
        topGender: topGender ? { gender: topGender[0], percentage: Math.round((topGender[1] / filteredSurveys.length) * 100) } : null,
        topAgeGroup: topAgeGroup ? { group: topAgeGroup[0], percentage: Math.round((topAgeGroup[1] / filteredSurveys.length) * 100) } : null,
      },
      experience: {
        topType: topExperienceType ? { type: topExperienceType[0], percentage: Math.round((topExperienceType[1] / filteredSurveys.length) * 100) } : null,
        topChannel: topChannel ? { channel: topChannel[0], percentage: Math.round((topChannel[1] / filteredSurveys.length) * 100) } : null,
      },
      expectations: {
        avgIngoing: avgIngoing.toFixed(1),
        avgOutgoing: avgOutgoing.toFixed(1),
        delta: expectationDelta.toFixed(1),
        exceededPercentage: Math.round((exceededCount / filteredSurveys.length) * 100),
        metPercentage: Math.round((metCount / filteredSurveys.length) * 100),
        belowPercentage: Math.round((belowCount / filteredSurveys.length) * 100),
      },
      desiredElements: {
        topElement: topDesiredElement ? { element: topDesiredElement[0], percentage: Math.round((topDesiredElement[1] / filteredSurveys.length) * 100) } : null,
      }
    };
  };
  
  // Get summary metrics
  const summaryMetrics = calculateSummaryMetrics();
  
  // Helper function to get shortened experience type for display
  const getShortenedExperienceType = (type: string) => {
    if (type.startsWith('I was researching')) return 'Researching';
    if (type.startsWith('I was purchasing')) return 'Purchasing';
    if (type.startsWith('I was using')) return 'Using';
    if (type.startsWith('I was looking for assistance')) return 'Support';
    return 'Other';
  };

  return (
    <div className="pt-2 sm:pt-4">
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Customer Survey Analytics
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Analysis of direct customer feedback across experience dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Experience Dimensions Visualization */}
          <div className="mb-8">
            <h3 className="text-base sm:text-lg font-medium mb-4">Customer Experience Dimensions</h3>
            
            {isMobile ? (
              // Mobile view: stacked layout
              <div className="grid grid-cols-1 gap-6">
                <SpiderDimensionsChart 
                  data={spiderData} 
                  onToggleCompetitors={handleToggleCompetitors}
                />
                <DimensionComparisonTable 
                  data={comparisonData} 
                  showCompetitors={showCompetitors}
                />
              </div>
            ) : (
              // Desktop view: connected cards layout
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r">
                    <SpiderDimensionsChart 
                      data={spiderData} 
                      onToggleCompetitors={handleToggleCompetitors}
                      connected={true}
                    />
                  </div>
                  <div className="p-3">
                    <DimensionComparisonTable 
                      data={comparisonData} 
                      showCompetitors={showCompetitors}
                      connected={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Metrics */}
          {summaryMetrics && (
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-medium mb-4">Survey Response Summary</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Demographics Card */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    <h4 className="font-medium">Demographics</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Responses:</span>
                      <span className="font-medium">{summaryMetrics.totalSurveys}</span>
                    </div>
                    {summaryMetrics.demographics.topGender && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Gender:</span>
                        <span className="font-medium">{summaryMetrics.demographics.topGender.gender} ({summaryMetrics.demographics.topGender.percentage}%)</span>
                      </div>
                    )}
                    {summaryMetrics.demographics.topAgeGroup && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Age Group:</span>
                        <span className="font-medium">{summaryMetrics.demographics.topAgeGroup.group} ({summaryMetrics.demographics.topAgeGroup.percentage}%)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Experience Types Card */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <PieChart className="h-5 w-5 mr-2 text-purple-500" />
                    <h4 className="font-medium">Experience</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {summaryMetrics.experience.topType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Type:</span>
                        <span className="font-medium">{getShortenedExperienceType(summaryMetrics.experience.topType.type)} ({summaryMetrics.experience.topType.percentage}%)</span>
                      </div>
                    )}
                    {summaryMetrics.experience.topChannel && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Channel:</span>
                        <span className="font-medium">{summaryMetrics.experience.topChannel.channel} ({summaryMetrics.experience.topChannel.percentage}%)</span>
                      </div>
                    )}
                    {summaryMetrics.desiredElements.topElement && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Desired Element:</span>
                        <span className="font-medium">{summaryMetrics.desiredElements.topElement.element} ({summaryMetrics.desiredElements.topElement.percentage}%)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expectations Card */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <BarChart className="h-5 w-5 mr-2 text-green-500" />
                    <h4 className="font-medium">Expectations</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Ingoing:</span>
                      <span className="font-medium">{summaryMetrics.expectations.avgIngoing}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Outgoing:</span>
                      <span className="font-medium">{summaryMetrics.expectations.avgOutgoing}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Delta:</span>
                      <span className={`font-medium flex items-center ${Number(summaryMetrics.expectations.delta) > 0 ? 'text-green-500' : Number(summaryMetrics.expectations.delta) < 0 ? 'text-red-500' : ''}`}>
                        {Number(summaryMetrics.expectations.delta) > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : Number(summaryMetrics.expectations.delta) < 0 ? (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        ) : null}
                        {Number(summaryMetrics.expectations.delta) > 0 ? '+' : ''}{summaryMetrics.expectations.delta}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Satisfaction Card */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <Info className="h-5 w-5 mr-2 text-amber-500" />
                    <h4 className="font-medium">Satisfaction</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Exceeded:</span>
                      <span className="font-medium flex items-center text-green-500">
                        <CircleCheck className="h-3 w-3 mr-1" />
                        {summaryMetrics.expectations.exceededPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Met:</span>
                      <span className="font-medium flex items-center text-amber-500">
                        {summaryMetrics.expectations.metPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Below:</span>
                      <span className="font-medium flex items-center text-red-500">
                        <CircleX className="h-3 w-3 mr-1" />
                        {summaryMetrics.expectations.belowPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Individual Survey Responses</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[640px] px-4 sm:px-0 sm:min-w-full">
                <SurveyResponseTable 
                  surveys={surveys} 
                  onViewSurvey={onViewSurvey} 
                  surveysPerPage={10}
                  onFilteredSurveysChange={updateFilteredSurveys}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSurveysTab;
