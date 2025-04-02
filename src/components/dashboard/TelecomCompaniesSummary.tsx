
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartBar, ArrowUp, ArrowDown } from 'lucide-react';

interface TelecomCompany {
  organization: string;
  cxIndex: number | string;
  directFeedback: number;
  passiveMetrics: number;
  trend: 'up' | 'down' | 'neutral';
}

interface TelecomCompaniesSummaryProps {
  telecomMetrics: TelecomCompany[];
}

const TelecomCompaniesSummary: React.FC<TelecomCompaniesSummaryProps> = ({ telecomMetrics }) => {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-primary" />
            Telecom Companies Performance Summary
          </CardTitle>
          <CardDescription>
            Key metrics for all telecom companies in the analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">CX Index</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Direct Feedback</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Passive Metrics</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Trend</th>
                </tr>
              </thead>
              <tbody>
                {telecomMetrics.map((company, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 font-medium">{company.organization}</td>
                    <td className="py-3 px-4 text-center">{company.cxIndex}</td>
                    <td className="py-3 px-4 text-center">{company.directFeedback}</td>
                    <td className="py-3 px-4 text-center">{company.passiveMetrics}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        {company.trend === 'up' ? (
                          <ArrowUp className="text-green-500" size={18} />
                        ) : company.trend === 'down' ? (
                          <ArrowDown className="text-red-500" size={18} />
                        ) : (
                          <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelecomCompaniesSummary;
