
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import SurveyDimensionsChart from '@/components/SurveyDimensionsChart';
import SurveyResponseTable from '@/components/SurveyResponseTable';
import { CustomerSurvey } from '@/services/customerSurveyData';

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
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Customer Experience Dimensions</h3>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[400px] sm:min-w-full">
                <SurveyDimensionsChart data={surveyDimensionsData} />
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Individual Survey Responses</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[640px] px-4 sm:px-0 sm:min-w-full">
                <SurveyResponseTable 
                  surveys={surveys} 
                  onViewSurvey={onViewSurvey} 
                  surveysPerPage={30}
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
