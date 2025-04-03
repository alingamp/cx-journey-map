
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import SurveyResponseTable from '@/components/SurveyResponseTable';
import { CustomerSurvey } from '@/services/customerSurveyData';
import SpiderDimensionsChart from '@/components/SpiderDimensionsChart';
import DimensionComparisonTable from '@/components/DimensionComparisonTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import SurveyDimensionsChart from '@/components/SurveyDimensionsChart';

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

          {/* Survey dimensions bar chart */}
          <div className="mb-8">
            <SurveyDimensionsChart data={surveyDimensionsData} />
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Individual Survey Responses</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[640px] px-4 sm:px-0 sm:min-w-full">
                <SurveyResponseTable 
                  surveys={surveys} 
                  onViewSurvey={onViewSurvey} 
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
