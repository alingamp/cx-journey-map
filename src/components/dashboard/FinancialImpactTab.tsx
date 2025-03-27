
import React, { useState } from 'react';
import FinancialImpact from '@/components/FinancialImpact';
import FinancialInsightCards from './FinancialInsightCards';

interface FinancialImpactTabProps {
  data: any;
}

const FinancialImpactTab: React.FC<FinancialImpactTabProps> = ({ data }) => {
  const [selectedFinancialIndustry, setSelectedFinancialIndustry] = useState<string>(data.industries[0]);

  return (
    <div className="pt-4 mt-0 animate-fade-in">
      {/* Financial Impact Analysis */}
      <div className="grid grid-cols-1 gap-6">
        <FinancialImpact 
          data={data.financialImpact} 
          industries={data.industries} 
          organizations={data.organizations}
          selectedIndustry={selectedFinancialIndustry}
          // Pass the setSelectedIndustry function to allow the component to update the state
          onIndustryChange={setSelectedFinancialIndustry}
        />
      </div>
      
      {/* Financial insights */}
      <FinancialInsightCards industries={data.industries} />
    </div>
  );
};

export default FinancialImpactTab;
