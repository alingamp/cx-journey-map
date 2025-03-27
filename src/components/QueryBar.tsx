
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getAllData } from '@/services/mockData';

const QueryBar = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const processQuery = async (queryText: string) => {
    setIsLoading(true);
    setShowResponse(true);
    
    try {
      // In a real app, this would call an actual LLM API
      // For now, we'll simulate responses based on the query text
      const data = getAllData();
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock response based on query keywords
      let generatedResponse = '';
      
      if (queryText.toLowerCase().includes('cxi') || queryText.toLowerCase().includes('cx index') || queryText.toLowerCase().includes('customer experience index')) {
        generatedResponse = `The average CX Index across all industries is ${(data.cxIndexData.reduce((sum, item) => sum + item.cxIndex, 0) / data.cxIndexData.length).toFixed(1)}. 
        The top performer is ${data.cxIndexData.reduce((prev, curr) => prev.cxIndex > curr.cxIndex ? prev : curr).organization} with a score of ${data.cxIndexData.reduce((prev, curr) => prev.cxIndex > curr.cxIndex ? prev : curr).cxIndex.toFixed(1)}.`;
      } else if (queryText.toLowerCase().includes('industry') || queryText.toLowerCase().includes('sector')) {
        const industries = [...new Set(data.cxIndexData.map(item => item.industry))];
        generatedResponse = `There are ${industries.length} industries in the dataset: ${industries.join(', ')}. 
        The industry with the highest average CX Index is ${industries.map(ind => {
          const indItems = data.cxIndexData.filter(item => item.industry === ind);
          const avgScore = indItems.reduce((sum, item) => sum + item.cxIndex, 0) / indItems.length;
          return { industry: ind, score: avgScore };
        }).sort((a, b) => b.score - a.score)[0].industry}.`;
      } else if (queryText.toLowerCase().includes('trend') || queryText.toLowerCase().includes('growth')) {
        generatedResponse = `The most improved organization is ${data.cxIndexData.reduce((prev, curr) => {
          const prevImprovement = prev.cxIndex - prev.lastYearIndex;
          const currImprovement = curr.cxIndex - curr.lastYearIndex;
          return prevImprovement > currImprovement ? prev : curr;
        }).organization} with a year-over-year improvement of ${(data.cxIndexData.reduce((prev, curr) => {
          const prevImprovement = prev.cxIndex - prev.lastYearIndex;
          const currImprovement = curr.cxIndex - curr.lastYearIndex;
          return prevImprovement > currImprovement ? prev : curr;
        }).cxIndex - data.cxIndexData.reduce((prev, curr) => {
          const prevImprovement = prev.cxIndex - prev.lastYearIndex;
          const currImprovement = curr.cxIndex - curr.lastYearIndex;
          return prevImprovement > currImprovement ? prev : curr;
        }).lastYearIndex).toFixed(1)} points.`;
      } else if (queryText.toLowerCase().includes('financial') || queryText.toLowerCase().includes('revenue') || queryText.toLowerCase().includes('impact')) {
        generatedResponse = `Organizations with high CX scores show on average 4.2% higher revenue growth compared to industry peers with lower scores. A 10-point improvement in CX score is projected to yield a 3.8% increase in retention and 2.5% improvement in profit margins.`;
      } else if (queryText.toLowerCase().includes('competitor') || queryText.toLowerCase().includes('competition')) {
        generatedResponse = `The competitive landscape analysis shows that ${data.industries[1]} and ${data.industries[3]} have the most intense competition. The organization with the highest market share is ${data.competitiveLandscape[0].organization} with ${data.competitiveLandscape[0].marketShare}% market share.`;
      } else {
        generatedResponse = `I analyzed the CX Analytics data for your query on "${queryText}". The top-performing organization across all metrics is ${data.cxIndexData.reduce((prev, curr) => prev.cxIndex > curr.cxIndex ? prev : curr).organization} with a CX Index of ${data.cxIndexData.reduce((prev, curr) => prev.cxIndex > curr.cxIndex ? prev : curr).cxIndex.toFixed(1)}. They excel particularly in the customer support and ease of use dimensions.`;
      }
      
      setResponse(generatedResponse);
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error processing query",
        description: "There was an issue analyzing your request.",
        variant: "destructive"
      });
      setResponse("I'm sorry, I couldn't process your query. Please try again with a different question.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    processQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about CX trends, industry performance, financial impact..."
          className="pr-10 py-2 w-full rounded-lg"
          autoComplete="off"
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      {showResponse && (
        <Card className={`mt-2 p-4 max-h-60 overflow-y-auto shadow-md transition-all duration-300 transform ${showResponse ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <p className="text-sm text-gray-500">Analyzing data for insights...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-line">{response}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default QueryBar;
