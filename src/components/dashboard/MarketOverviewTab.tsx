
import React from 'react';
import SummaryCards from './SummaryCards';
import CXIndexSummary from '@/components/CXIndexSummary';
import IndustryLoadings from '@/components/IndustryLoadings';
import FeedbackDiagnostics from '@/components/FeedbackDiagnostics';
import ExperienceImpact from '@/components/ExperienceImpact';
import PassiveMetrics from '@/components/PassiveMetrics';

interface MarketOverviewTabProps {
  data: any;
}

const MarketOverviewTab: React.FC<MarketOverviewTabProps> = ({ data }) => {
  // Extract top and bottom performers from CX Index data
  const topPerformer = data.cxIndexData.reduce((prev: any, curr: any) => 
    prev.cxIndex > curr.cxIndex ? prev : curr
  );
  
  const bottomPerformer = data.cxIndexData.reduce((prev: any, curr: any) => 
    prev.cxIndex < curr.cxIndex ? prev : curr
  );
  
  // Calculate overall average CX score
  const avgCXScore = data.cxIndexData.reduce((sum: number, item: any) => 
    sum + item.cxIndex, 0
  ) / data.cxIndexData.length;
  
  // Find most improved organization
  const mostImproved = data.cxIndexData.reduce((prev: any, curr: any) => {
    const prevImprovement = prev.cxIndex - prev.lastYearIndex;
    const currImprovement = curr.cxIndex - curr.lastYearIndex;
    return prevImprovement > currImprovement ? prev : curr;
  });

  return (
    <div className="pt-4 mt-0 animate-fade-in">
      {/* Summary stats cards */}
      <SummaryCards 
        avgCXScore={avgCXScore} 
        topPerformer={topPerformer} 
        bottomPerformer={bottomPerformer} 
        mostImproved={mostImproved}
      />
      
      {/* CX Index Summary and Industry Loadings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CXIndexSummary 
          data={data.cxIndexData} 
          industries={data.industries} 
        />
        <IndustryLoadings 
          data={data.industryLoadings} 
          industries={data.industries} 
          dimensions={data.cxDimensions} 
        />
      </div>
      
      {/* Feedback Diagnostics and Experience Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FeedbackDiagnostics 
          data={data.feedbackDiagnostics} 
          industries={data.industries} 
          organizations={data.organizations} 
          dimensions={data.cxDimensions} 
        />
        <ExperienceImpact 
          data={data.experienceImpact} 
          industries={data.industries} 
          organizations={data.organizations} 
          dimensions={data.cxDimensions} 
        />
      </div>
      
      {/* Passive Metrics Visualization */}
      <div className="grid grid-cols-1 gap-6">
        <PassiveMetrics 
          data={data.passiveMetrics} 
          industries={data.industries} 
          organizations={data.organizations} 
        />
      </div>
    </div>
  );
};

export default MarketOverviewTab;
