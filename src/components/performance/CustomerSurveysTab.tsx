
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
    <div className="pt-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Customer Survey Analytics
          </CardTitle>
          <CardDescription>
            Analysis of direct customer feedback across experience dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Customer Experience Dimensions</h3>
            <SurveyDimensionsChart data={surveyDimensionsData} />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Individual Survey Responses</h3>
            <SurveyResponseTable 
              surveys={surveys} 
              onViewSurvey={onViewSurvey} 
              surveysPerPage={30} // Increased from default 20 to 30
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSurveysTab;
