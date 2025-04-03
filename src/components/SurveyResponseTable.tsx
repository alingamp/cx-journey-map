
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CustomerSurvey } from '@/services/customerSurveyData';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft,
  ChevronRight,
  User, 
  Search, 
  MessageSquare,
  Smartphone,
  Tablet,
  Computer,
  MapPin,
  PhoneCall
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SurveyResponseTableProps {
  surveys: CustomerSurvey[];
  onViewSurvey: (survey: CustomerSurvey) => void;
  surveysPerPage?: number;
  onFilteredSurveysChange?: (filteredSurveys: CustomerSurvey[]) => void;
}

const SurveyResponseTable: React.FC<SurveyResponseTableProps> = ({ 
  surveys, 
  onViewSurvey,
  surveysPerPage = 20, // Default to 20 if not specified
  onFilteredSurveysChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
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
  
  // Inform parent about filtered surveys
  useEffect(() => {
    onFilteredSurveysChange?.(filteredSurveys);
  }, [filteredSurveys, onFilteredSurveysChange]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedType, selectedChannel]);
  
  // Pagination
  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage);
  const paginatedSurveys = filteredSurveys.slice(
    currentPage * surveysPerPage, 
    (currentPage + 1) * surveysPerPage
  );

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
  
  // Generate page buttons
  const getPageButtons = () => {
    const buttons = [];
    
    // Always show first page
    buttons.push(
      <Button
        key="first"
        variant={currentPage === 0 ? "default" : "outline"}
        size="icon"
        className="h-8 w-8"
        onClick={() => setCurrentPage(0)}
        disabled={currentPage === 0}
      >
        1
      </Button>
    );
    
    // Show ellipsis if needed
    if (currentPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="mx-1">...</span>
      );
    }
    
    // Show current page and neighbors
    for (let i = Math.max(1, currentPage); i <= Math.min(currentPage + 1, totalPages - 2); i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </Button>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 3) {
      buttons.push(
        <span key="ellipsis2" className="mx-1">...</span>
      );
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key="last"
          variant={currentPage === totalPages - 1 ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };
  
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{currentPage * surveysPerPage + 1}</span> to <span className="font-medium">{Math.min((currentPage + 1) * surveysPerPage, filteredSurveys.length)}</span> of <span className="font-medium">{filteredSurveys.length}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Previous Page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center">
              {getPageButtons()}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              <span className="sr-only">Next Page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponseTable;
