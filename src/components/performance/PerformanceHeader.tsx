
import React from 'react';
import { Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PerformanceHeaderProps {
  selectedOrg: string;
  handleOrgChange: (value: string) => void;
  organizations: string[];
}

const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({ 
  selectedOrg, 
  handleOrgChange, 
  organizations 
}) => {
  const onOrgChange = (value: string) => {
    // Only for display purposes - don't actually change the organization
    if (value !== "AT&T") {
      toast.info("This is a demo focusing on AT&T data only");
      return;
    }
    handleOrgChange(value);
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight animate-fade-in">OW CX Index Performance Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500 animate-fade-in" style={{ animationDelay: '100ms' }}>
              View detailed performance metrics and analytics
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-64 mt-3 md:mt-0">
          <Select value={selectedOrg} onValueChange={onOrgChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org: string) => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeader;
