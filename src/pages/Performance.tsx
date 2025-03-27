
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, BarChart4, Activity, Target, User, Users, LineChart } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import CXIndexSummary from '@/components/CXIndexSummary';
import FinancialImpact from '@/components/FinancialImpact';
import FeedbackDiagnostics from '@/components/FeedbackDiagnostics';
import ExperienceImpact from '@/components/ExperienceImpact';
import PassiveMetrics from '@/components/PassiveMetrics';
import CompetitiveIntensityChart from '@/components/charts/CompetitiveIntensityChart';
import { getAllData } from '@/services/mockData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Performance = () => {
  const navigate = useNavigate();
  const data = getAllData();
  const [selectedIndustry, setSelectedIndustry] = useState(data.industries[0]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [orgData, setOrgData] = useState<any>(null);
  const [competitorData, setCompetitorData] = useState<any[]>([]);
  
  // Set the first organization when industry changes
  useEffect(() => {
    if (data.organizations[selectedIndustry] && data.organizations[selectedIndustry].length > 0) {
      setSelectedOrganization(data.organizations[selectedIndustry][0]);
    }
  }, [selectedIndustry, data.organizations]);
  
  // Update data when organization selection changes
  useEffect(() => {
    if (!selectedOrganization) return;
    
    // Find organization data
    const selectedOrgData = data.cxIndexData.find(item => 
      item.industry === selectedIndustry && 
      item.organization === selectedOrganization
    );
    
    if (selectedOrgData) {
      setOrgData(selectedOrgData);
      
      // Get competitor data (other organizations in the same industry)
      const competitors = data.cxIndexData
        .filter(item => 
          item.industry === selectedIndustry && 
          item.organization !== selectedOrganization
        )
        .sort((a, b) => b.cxIndex - a.cxIndex);
      
      setCompetitorData(competitors);
    }
  }, [selectedIndustry, selectedOrganization, data.cxIndexData]);
  
  // Memoized calculation of industry average
  const industryAverage = React.useMemo(() => {
    return data.cxIndexData
      .filter(item => item.industry === selectedIndustry)
      .reduce((acc, item) => acc + item.cxIndex, 0) / 
      data.cxIndexData.filter(item => item.industry === selectedIndustry).length;
  }, [selectedIndustry, data.cxIndexData]);
  
  // Memoized calculation of organization rank
  const getOrgRank = React.useCallback(() => {
    if (!orgData) return 'N/A';
    
    const industryOrgs = data.cxIndexData
      .filter(item => item.industry === selectedIndustry)
      .sort((a, b) => b.cxIndex - a.cxIndex);
    
    const rank = industryOrgs.findIndex(item => item.organization === selectedOrganization) + 1;
    return `${rank} of ${industryOrgs.length}`;
  }, [selectedIndustry, selectedOrganization, orgData, data.cxIndexData]);

  // Navigate to customer insights for this organization
  const navigateToCustomerInsights = () => {
    navigate('/customer-insights', { 
      state: { 
        selectedIndustry, 
        selectedOrganization 
      } 
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              Organization Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive CX performance for a specific organization
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {data.industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedOrganization} 
              onValueChange={setSelectedOrganization}
              disabled={!selectedIndustry}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                {selectedIndustry && data.organizations[selectedIndustry]?.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {orgData && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CX Index Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {orgData.cxIndex}
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${orgData.cxIndex > orgData.lastYearIndex ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                      {orgData.cxIndex > orgData.lastYearIndex ? '↑' : '↓'} 
                      {Math.abs(orgData.cxIndex - orgData.lastYearIndex).toFixed(1)} points
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">vs last year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Industry Rank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getOrgRank()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    In {selectedIndustry}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">vs Industry Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {(orgData.cxIndex - industryAverage).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry avg: {industryAverage.toFixed(1)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[60px] flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground">
                      View detailed customer survey data
                    </p>
                    <Button 
                      onClick={navigateToCustomerInsights}
                      className="w-full mt-2"
                      size="sm"
                    >
                      Explore Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Radar chart of all dimensions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Dimension Performance</CardTitle>
                      <CardDescription>
                        {selectedOrganization}'s performance across all CX dimensions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            data={React.useMemo(() => {
                              const feedbackItem = data.feedbackDiagnostics
                                .find(item => 
                                  item.industry === selectedIndustry && 
                                  item.organization === selectedOrganization
                                );
                              
                              if (!feedbackItem) return [];
                              
                              return data.cxDimensions.map(dim => ({
                                dimension: dim,
                                value: feedbackItem[dim]
                              }));
                            }, [selectedIndustry, selectedOrganization, data.feedbackDiagnostics, data.cxDimensions])}
                          >
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="dimension" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} />
                            <Radar
                              name={selectedOrganization}
                              dataKey="value"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.4}
                            />
                            <Tooltip formatter={(value) => [value, 'Score']} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Passive metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Passive Metrics</CardTitle>
                      <CardDescription>
                        Engagement data from non-survey sources
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        {selectedOrganization && (
                          <PassiveMetrics 
                            data={data.passiveMetrics}
                            industries={[selectedIndustry]}
                            organizations={{ [selectedIndustry]: [selectedOrganization] }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Historical data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Intensity Trend</CardTitle>
                    <CardDescription>
                      Industry competitive landscape over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CompetitiveIntensityChart 
                        data={data.competitiveLandscape.filter(item => item.industry === selectedIndustry)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="competitors" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Competitor Comparison</CardTitle>
                    <CardDescription>
                      {selectedOrganization}'s CX performance vs. competitors in {selectedIndustry}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={React.useMemo(() => {
                            if (!orgData) return [];
                            
                            return [
                              {
                                organization: selectedOrganization,
                                cxIndex: orgData.cxIndex,
                                isSelected: true
                              },
                              ...competitorData.slice(0, 5).map(comp => ({
                                ...comp,
                                isSelected: false
                              }))
                            ];
                          }, [orgData, selectedOrganization, competitorData])}
                          margin={{
                            top: 5, right: 30, left: 80, bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[50, 100]} />
                          <YAxis 
                            dataKey="organization" 
                            type="category" 
                            tick={{ fontSize: 12 }}
                            width={80}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value}`, 'CX Index']}
                          />
                          <Bar dataKey="cxIndex" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                            <LabelList dataKey="cxIndex" position="right" formatter={(v: number) => v.toFixed(1)} />
                            {React.useMemo(() => {
                              if (!orgData) return [];
                              
                              return [orgData, ...competitorData].map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.organization === selectedOrganization ? '#10b981' : '#3b82f6'} 
                                />
                              ));
                            }, [orgData, competitorData, selectedOrganization])}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>YoY Improvement</CardTitle>
                      <CardDescription>
                        How organizations have improved year over year
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={React.useMemo(() => {
                              if (!orgData) return [];
                              
                              return [
                                {
                                  organization: selectedOrganization,
                                  change: parseFloat((orgData.cxIndex - orgData.lastYearIndex).toFixed(1)),
                                  isSelected: true
                                },
                                ...competitorData.slice(0, 5).map(comp => ({
                                  organization: comp.organization,
                                  change: parseFloat((comp.cxIndex - comp.lastYearIndex).toFixed(1)),
                                  isSelected: false
                                }))
                              ];
                            }, [orgData, selectedOrganization, competitorData])}
                            margin={{
                              top: 5, right: 30, left: 80, bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis 
                              type="number" 
                              domain={[-10, 10]} 
                              tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}`}
                            />
                            <YAxis 
                              dataKey="organization" 
                              type="category" 
                              tick={{ fontSize: 12 }}
                              width={80}
                            />
                            <Tooltip 
                              formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Change']}
                            />
                            <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                              <LabelList dataKey="change" position="right" formatter={(v: number) => `${v > 0 ? '+' : ''}${v}`} />
                              {React.useMemo(() => {
                                if (!orgData) return [];
                                
                                return [...competitorData, orgData].map((entry) => {
                                  const change = entry.cxIndex - entry.lastYearIndex;
                                  return (
                                    <Cell 
                                      key={`cell-${entry.organization}`} 
                                      fill={change > 0 ? '#10b981' : '#ef4444'} 
                                    />
                                  );
                                });
                              }, [orgData, competitorData])}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Dimension Gap Analysis</CardTitle>
                      <CardDescription>
                        Gap between your organization and top performer
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        {competitorData.length > 0 && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              layout="vertical"
                              data={React.useMemo(() => {
                                if (competitorData.length === 0) return [];
                                
                                return data.cxDimensions.map(dim => {
                                  const orgFeedback = data.feedbackDiagnostics.find(
                                    f => f.organization === selectedOrganization && f.industry === selectedIndustry
                                  );
                                  
                                  const topCompetitorFeedback = data.feedbackDiagnostics.find(
                                    f => f.organization === competitorData[0].organization && f.industry === selectedIndustry
                                  );
                                  
                                  const orgScore = orgFeedback ? orgFeedback[dim] : 0;
                                  const topScore = topCompetitorFeedback ? topCompetitorFeedback[dim] : 0;
                                  
                                  return {
                                    dimension: dim,
                                    gap: parseFloat((orgScore - topScore).toFixed(1))
                                  };
                                });
                              }, [data.cxDimensions, selectedOrganization, selectedIndustry, competitorData, data.feedbackDiagnostics])}
                              margin={{
                                top: 5, right: 30, left: 80, bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                              <XAxis 
                                type="number" 
                                domain={[-15, 15]} 
                                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}`}
                              />
                              <YAxis 
                                dataKey="dimension" 
                                type="category" 
                                tick={{ fontSize: 12 }}
                                width={80}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Gap']}
                                labelFormatter={(value) => `${value} gap`}
                              />
                              <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                                <LabelList dataKey="gap" position="right" formatter={(v: number) => `${v > 0 ? '+' : ''}${v}`} />
                                {React.useMemo(() => {
                                  if (competitorData.length === 0) return [];
                                  
                                  return data.cxDimensions.map((dim) => {
                                    const orgScore = data.feedbackDiagnostics.find(
                                      f => f.organization === selectedOrganization && f.industry === selectedIndustry
                                    )?.[dim] || 0;
                                    
                                    const topScore = data.feedbackDiagnostics.find(
                                      f => f.organization === competitorData[0]?.organization && f.industry === selectedIndustry
                                    )?.[dim] || 0;
                                    
                                    return (
                                      <Cell 
                                        key={`cell-${dim}`} 
                                        fill={orgScore > topScore ? '#10b981' : '#ef4444'} 
                                      />
                                    );
                                  });
                                }, [data.cxDimensions, selectedOrganization, selectedIndustry, competitorData, data.feedbackDiagnostics])}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="feedback" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Direct Feedback Diagnostics</CardTitle>
                      <CardDescription>
                        Customer feedback across dimensions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <FeedbackDiagnostics 
                        data={data.feedbackDiagnostics.filter(item => 
                          item.industry === selectedIndustry
                        )}
                        industries={[selectedIndustry]}
                        organizations={{ [selectedIndustry]: [selectedOrganization] }}
                        dimensions={data.cxDimensions}
                        defaultOrg={selectedOrganization}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Experience Impact</CardTitle>
                      <CardDescription>
                        Gap between incoming and outgoing expectations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ExperienceImpact 
                        data={data.experienceImpact.filter(item => 
                          item.industry === selectedIndustry && 
                          item.organization === selectedOrganization
                        )}
                        industries={[selectedIndustry]}
                        organizations={{ [selectedIndustry]: [selectedOrganization] }}
                        dimensions={data.cxDimensions}
                        defaultOrg={selectedOrganization}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="mt-4">
                <FinancialImpact 
                  data={data.financialImpact.filter(item => 
                    item.industry === selectedIndustry
                  )}
                  industries={[selectedIndustry]}
                  organizations={{ [selectedIndustry]: [selectedOrganization] }}
                  selectedIndustry={selectedIndustry}
                  defaultOrg={selectedOrganization}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Performance;
