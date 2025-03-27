import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  User, 
  BarChart2, 
  PieChart as PieChartIcon,
  CalendarDays,
  Building,
  MessageSquare
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAllData } from '@/services/mockData';
import { 
  getCustomerSurveys, 
  calculateSurveyStats, 
  CustomerSurvey, 
  SurveyStats 
} from '@/services/customerSurveyData';
import SurveyDetailDialog from '@/components/SurveyDetailDialog';

const CustomerInsights = () => {
  const allData = getAllData();
  const [surveys, setSurveys] = useState<CustomerSurvey[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<CustomerSurvey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all-industries');
  const [page, setPage] = useState(0);
  const surveysPerPage = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Load survey data on mount
  useEffect(() => {
    const surveyData = getCustomerSurveys(allData.industries, allData.organizations);
    setSurveys(surveyData);
    
    // Calculate statistics
    const surveyStats = calculateSurveyStats(surveyData);
    setStats(surveyStats);
  }, []);
  
  // Filter surveys based on search query and industry
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = searchQuery === '' || 
                         survey.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all-industries' || survey.industry === selectedIndustry;
    
    return matchesSearch && matchesIndustry;
  });
  
  // Pagination
  const paginatedSurveys = filteredSurveys.slice(
    page * surveysPerPage, 
    (page + 1) * surveysPerPage
  );
  
  // Total pages
  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage);
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleViewSurvey = (survey: CustomerSurvey) => {
    setSelectedSurvey(survey);
    setDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Customer Insights
            </h1>
            <p className="text-muted-foreground">
              Analyze customer survey responses and demographic data
            </p>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Survey Analytics Dashboard</CardTitle>
              <CardDescription>
                Overview of {stats.totalRespondents} customer survey responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="col-span-2 lg:col-span-1">
                  <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.ageDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Gender</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.genderDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="gender"
                          label={({ gender, percent }) => 
                            `${gender}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {stats.genderDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [value, props.payload.gender]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Income Distribution</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.incomeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="range"
                        >
                          {stats.incomeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <Tooltip 
                          formatter={(value, name, props) => [value, props.payload.range]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Experience Type</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={stats.experienceTypeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Channel</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={stats.channelDistribution}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="channel" type="category" tick={{ fontSize: 11 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-sm font-medium mb-2">Average Element Scores</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={stats.averageElementScores}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis 
                          dataKey="element" 
                          type="category" 
                          tick={{ fontSize: 11 }} 
                          width={120} 
                        />
                        <Tooltip formatter={(value) => [`${value}/10`, 'Score']} />
                        <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <div className="border rounded-md p-4 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Expectation Gap</h3>
                      <div className="text-3xl font-bold">
                        {stats.expectationGap > 0 ? '+' : ''}{stats.expectationGap}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Difference between outgoing and incoming expectations
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className={`text-sm font-medium ${stats.expectationGap > 0 ? 'text-green-600' : stats.expectationGap < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {stats.expectationGap > 0 
                          ? 'Expectations Exceeded' 
                          : stats.expectationGap < 0 
                          ? 'Expectations Not Met'
                          : 'Expectations Met'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Survey Responses */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Responses</CardTitle>
            <CardDescription>
              Individual customer survey responses with detailed insights
            </CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by ID or organization..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-industries">All Industries</SelectItem>
                  {allData.industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSurveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell className="font-medium">{survey.id}</TableCell>
                      <TableCell>{survey.industry}</TableCell>
                      <TableCell>{survey.organization}</TableCell>
                      <TableCell>{survey.demographics.age}</TableCell>
                      <TableCell>{survey.demographics.gender}</TableCell>
                      <TableCell>{survey.experience.type}</TableCell>
                      <TableCell>{survey.experience.channel}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewSurvey(survey)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {paginatedSurveys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No survey responses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{page * surveysPerPage + 1}</span> to <span className="font-medium">{Math.min((page + 1) * surveysPerPage, filteredSurveys.length)}</span> of <span className="font-medium">{filteredSurveys.length}</span> results
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Survey Detail Dialog */}
        <SurveyDetailDialog
          survey={selectedSurvey}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerInsights;
