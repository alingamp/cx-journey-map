
import React from 'react';
import CorrelationAnalysis from '@/components/CorrelationAnalysis';
import CompetitiveLandscape from '@/components/CompetitiveLandscape';

interface CompetitiveAnalysisTabProps {
  data: any;
  competitiveLandscape: any[];
}

const CompetitiveAnalysisTab: React.FC<CompetitiveAnalysisTabProps> = ({ data, competitiveLandscape }) => {
  return (
    <div className="pt-4 mt-0 animate-fade-in">
      {/* Correlation Analysis */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <CorrelationAnalysis 
          data={data.correlationData} 
          industries={data.industries} 
          financialMetrics={data.financialMetrics} 
        />
      </div>
      
      {/* Competitive Landscape */}
      <div className="grid grid-cols-1 gap-6">
        <CompetitiveLandscape 
          data={competitiveLandscape} 
          industries={data.industries} 
        />
      </div>
    </div>
  );
};

export default CompetitiveAnalysisTab;
