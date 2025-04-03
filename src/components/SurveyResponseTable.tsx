
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CustomerSurvey } from '@/services/customerSurveyData';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  User, 
  CalendarDays, 
  Building, 
  MessageSquare,
  Smartphone,
  Tablet,
  Computer,
  MapPin,
  PhoneCall
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SurveyResponseTableProps {
  surveys: CustomerSurvey[];
  onViewSurvey: (survey: CustomerSurvey) => void;
  surveysPerPage?: number;
}

const SurveyResponseTable: React.FC<SurveyResponseTableProps> = ({ 
  surveys, 
  onViewSurvey,
  surveysPerPage = 10 // Changed default to 10 per page
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selectedType, setSelectedType] = useState<string>('all-types');
  const [selectedChannel, setSelectedChannel] = useState<string>('all-channels');
  
  // Filter surveys based on search query and type
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = searchQuery === '' || 
                        survey.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        survey.demographics.gender.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all-types' || survey.experience.type === selectedType;
    const matchesChannel = selectedChannel === 'all-channels' || survey.experience.channel === selectedChannel;
    
    return matchesSearch && matchesType && matchesChannel;
  });
  
  // Pagination
  const paginatedSurveys = filteredSurveys.slice(
    page * surveysPerPage, 
    (page + 1) * surveysPerPage
  );
  
  // Total pages
  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage);

  // Get unique experience types and channels for filters
  const experienceTypes = Array.from(new Set(surveys.map(s => s.experience.type)));
  const channels = Array.from(new Set(surveys.map(s => s.experience.channel)));
  
  // Function to get shortened experience type for display
  const getShortenedExperienceType = (type: string) => {
    if (type.startsWith('I was researching')) return 'Researching';
    if (type.startsWith('I was purchasing')) return 'Purchasing';
    if (type.startsWith('I was using')) return 'Using';
    if (type.startsWith('I was looking for assistance')) return 'Support';
    return 'Other';
  };
  
  // Function to get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'On a phone':
        return <Smartphone className="h-3 w-3 text-muted-foreground mr-1" />;
      case 'On a tablet':
        return <Tablet className="h-3 w-3 text-muted-foreground mr-1" />;
      case 'On a computer':
        return <Computer className="h-3 w-3 text-muted-foreground mr-1" />;
      case 'In-person':
        return <MapPin className="h-3 w-3 text-muted-foreground mr-1" />;
      case 'Over the phone':
        return <PhoneCall className="h-3 w-3 text-muted-foreground mr-1" />;
      default:
        return null;
    }
  };

  // Calculate survey metrics summary
  const calculateSurveyMetricsSummary = () => {
    if (filteredSurveys.length === 0) return null;
    
    // Age groups
    const ageGroups = {
      '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65+': 0
    };
    
    // Gender distribution
    const genderCounts: {[key: string]: number} = {};
    
    // Experience type distribution
    const typeCounts: {[key: string]: number} = {};
    
    // Channel distribution
    const channelCounts: {[key: string]: number} = {};
    
    // Expectations
    let expectationsMet = 0;
    let expectationsExceeded = 0;
    let expectationsNotMet = 0;
    
    filteredSurveys.forEach(survey => {
      // Age distribution
      const age = survey.demographics.age;
      if (age < 25) ageGroups['18-24']++;
      else if (age < 35) ageGroups['25-34']++;
      else if (age < 45) ageGroups['35-44']++;
      else if (age < 55) ageGroups['45-54']++;
      else if (age < 65) ageGroups['55-64']++;
      else ageGroups['65+']++;
      
      // Gender counts
      const gender = survey.demographics.gender;
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      
      // Experience type counts
      const type = getShortenedExperienceType(survey.experience.type);
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      
      // Channel counts
      const channel = survey.experience.channel;
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      
      // Expectation outcomes
      if (survey.impact.outgoingExpectation > survey.experience.ingoingExpectation) {
        expectationsExceeded++;
      } else if (survey.impact.outgoingExpectation < survey.experience.ingoingExpectation) {
        expectationsNotMet++;
      } else {
        expectationsMet++;
      }
    });
    
    return {
      totalSurveys: filteredSurveys.length,
      ageGroups,
      genderCounts,
      typeCounts,
      channelCounts,
      expectations: {
        met: expectationsMet,
        exceeded: expectationsExceeded,
        notMet: expectationsNotMet
      }
    };
  };
  
  const metricsSummary = calculateSurveyMetricsSummary();
  
  // Generate pagination links
  const generatePaginationLinks = () => {
    const pageLinks = [];
    const maxVisiblePages = 5; // Max pages to show in pagination
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setPage(i)}
              isActive={page === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      pageLinks.push(
        <PaginationItem key={0}>
          <PaginationLink 
            onClick={() => setPage(0)}
            isActive={page === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if current page is not near the beginning
      if (page > 2) {
        pageLinks.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Add pages around current page
      const startPage = Math.max(1, Math.min(page - 1, totalPages - 4));
      const endPage = Math.min(startPage + 2, totalPages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i === 0 || i === totalPages - 1) continue; // Skip first and last page as they're added separately
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setPage(i)}
              isActive={page === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis if current page is not near the end
      if (page < totalPages - 3) {
        pageLinks.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show last page
      pageLinks.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink 
            onClick={() => setPage(totalPages - 1)}
            isActive={page === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageLinks;
  };
  
  return (
    <div>
      {/* Survey Metrics Summary */}
      {metricsSummary && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Survey Metrics Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              {/* Demographics */}
              <div>
                <h4 className="font-medium mb-2">Demographics</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Total Responses:</span>
                    <span className="font-medium">{metricsSummary.totalSurveys}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 mb-1">Age Groups:</div>
                  {Object.entries(metricsSummary.ageGroups)
                    .filter(([_, count]) => count > 0)
                    .map(([range, count]) => (
                      <div key={range} className="flex justify-between">
                        <span>{range}:</span>
                        <span>{count} ({((count / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Gender Distribution */}
              <div>
                <h4 className="font-medium mb-2">Gender Distribution</h4>
                <div className="space-y-1">
                  {Object.entries(metricsSummary.genderCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([gender, count]) => (
                      <div key={gender} className="flex justify-between">
                        <span>{gender}:</span>
                        <span>{count} ({((count / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Experience Types */}
              <div>
                <h4 className="font-medium mb-2">Experience Types</h4>
                <div className="space-y-1">
                  {Object.entries(metricsSummary.typeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span>{type}:</span>
                        <span>{count} ({((count / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Channels & Expectations */}
              <div>
                <h4 className="font-medium mb-2">Channels & Expectations</h4>
                <div className="space-y-1">
                  {Object.entries(metricsSummary.channelCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([channel, count]) => (
                      <div key={channel} className="flex justify-between">
                        <span className="flex items-center">{getChannelIcon(channel)}{channel}:</span>
                        <span>{count} ({((count / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                      </div>
                    ))
                  }
                  
                  <div className="border-t mt-2 pt-2">
                    <div className="text-xs text-muted-foreground mb-1">Expectations:</div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Exceeded:</span>
                      <span>{metricsSummary.expectations.exceeded} ({((metricsSummary.expectations.exceeded / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Met:</span>
                      <span>{metricsSummary.expectations.met} ({((metricsSummary.expectations.met / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Not Met:</span>
                      <span>{metricsSummary.expectations.notMet} ({((metricsSummary.expectations.notMet / metricsSummary.totalSurveys) * 100).toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search surveys..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Experience Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Experience Types</SelectItem>
            {experienceTypes.map(type => (
              <SelectItem key={type} value={type}>{getShortenedExperienceType(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-channels">All Channels</SelectItem>
            {channels.map(channel => (
              <SelectItem key={channel} value={channel}>{channel}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Demographics</TableHead>
              <TableHead>Experience Type</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Expectations</TableHead>
              <TableHead>Desired Elements</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSurveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{survey.demographics.age}, {survey.demographics.gender}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Income: {survey.demographics.income}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span title={survey.experience.type}>
                    {getShortenedExperienceType(survey.experience.type)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getChannelIcon(survey.experience.channel)}
                    <span>{survey.experience.channel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs">
                      In: <span className="font-medium">{survey.experience.ingoingExpectation}/10</span>
                    </div>
                    <div className="text-xs">
                      Out: <span className="font-medium">{survey.impact.outgoingExpectation}/10</span>
                    </div>
                    <Badge variant={survey.impact.outgoingExpectation >= survey.experience.ingoingExpectation ? "success" : "destructive"} className="w-fit mt-1">
                      {survey.impact.outgoingExpectation > survey.experience.ingoingExpectation 
                        ? 'Exceeded' 
                        : survey.impact.outgoingExpectation < survey.experience.ingoingExpectation 
                          ? 'Below' 
                          : 'Met'} Expectations
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {survey.experience.desiredElements.map((element, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {element}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewSurvey(survey)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {paginatedSurveys.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No survey responses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(0, page - 1))}
                  className={page === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {generatePaginationLinks()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  className={page === totalPages - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="text-sm text-center text-muted-foreground mt-2">
            Showing {page * surveysPerPage + 1} to {Math.min((page + 1) * surveysPerPage, filteredSurveys.length)} of {filteredSurveys.length} results
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponseTable;
