
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CustomerSurvey } from '@/services/customerSurveyData';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Search, User, CalendarDays, Building, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SurveyResponseTableProps {
  surveys: CustomerSurvey[];
  onViewSurvey: (survey: CustomerSurvey) => void;
}

const SurveyResponseTable: React.FC<SurveyResponseTableProps> = ({ surveys, onViewSurvey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selectedType, setSelectedType] = useState<string>('all-types');
  const [selectedChannel, setSelectedChannel] = useState<string>('all-channels');
  const surveysPerPage = 10;
  
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
  
  return (
    <div>
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
              <SelectItem key={type} value={type}>{type}</SelectItem>
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
                <TableCell>{survey.experience.type}</TableCell>
                <TableCell>{survey.experience.channel}</TableCell>
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
    </div>
  );
};

export default SurveyResponseTable;
