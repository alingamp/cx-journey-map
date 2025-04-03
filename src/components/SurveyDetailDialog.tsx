
import React from 'react';
import { CustomerSurvey } from '@/services/customerSurveyData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  User,
  Building,
  MessageSquare,
  BarChart2,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface SurveyDetailDialogProps {
  survey: CustomerSurvey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurveyDetailDialog = ({ 
  survey, 
  open, 
  onOpenChange 
}: SurveyDetailDialogProps) => {
  if (!survey) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Survey Response Detail - {survey.id}
          </DialogTitle>
          <DialogDescription>
            Detailed survey response from {survey.organization} customer
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 mt-4">
          {/* Screening & Demographics */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2 pb-2 border-b">
              <User className="h-4 w-4" /> Screening & Demographics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Age</p>
                <p className="text-sm">{survey.demographics.age} years</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-sm">{survey.demographics.gender}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Income</p>
                <p className="text-sm">{survey.demographics.income}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Recent Experience</p>
                <p className="text-sm">{survey.demographics.hasRecentExperience ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2 pb-2 border-b">
              <Building className="h-4 w-4" /> Organization Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Organization</p>
                <p className="text-sm">{survey.organization}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Industry</p>
                <p className="text-sm">{survey.industry}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Survey Date</p>
                <p className="text-sm">{survey.surveyDate}</p>
              </div>
            </div>
          </div>
          
          {/* Experience Details */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2 pb-2 border-b">
              <MessageSquare className="h-4 w-4" /> Experience Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Type of Experience</p>
                <p className="text-sm break-words">{survey.experience.type}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Channel</p>
                <p className="text-sm">{survey.experience.channel}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Initial Expectation</p>
                  <p className="text-sm">{survey.experience.ingoingExpectation}/10</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Importance of Good Experience</p>
                  <p className="text-sm">{survey.experience.importanceOfGoodExperience}/10</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Desired Elements</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {survey.experience.desiredElements.map((element, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Evaluation */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2 pb-2 border-b">
              <BarChart2 className="h-4 w-4" /> Experience Evaluation
            </h3>
            
            <div>
              {Object.entries(survey.evaluation).map(([element, score], index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{element}</span>
                    <span className="font-medium">{score}/10</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        score >= 8 ? 'bg-green-500' : 
                        score >= 6 ? 'bg-amber-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <p className="text-sm font-medium">Outgoing Expectation</p>
              <div className="flex items-center mt-1">
                <span className="mr-2 text-sm">{survey.impact.outgoingExpectation}/10</span>
                {survey.impact.outgoingExpectation > survey.experience.ingoingExpectation ? (
                  <span className="text-xs text-green-500 flex items-center">
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Improved by {survey.impact.outgoingExpectation - survey.experience.ingoingExpectation}
                  </span>
                ) : survey.impact.outgoingExpectation < survey.experience.ingoingExpectation ? (
                  <span className="text-xs text-red-500 flex items-center">
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Decreased by {survey.experience.ingoingExpectation - survey.impact.outgoingExpectation}
                  </span>
                ) : (
                  <span className="text-xs text-amber-500">Unchanged</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDetailDialog;
