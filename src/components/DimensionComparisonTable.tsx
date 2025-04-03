
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface DimensionComparisonData {
  dimension: string;
  industry: number;
  att: number;
  delta: number;
  fullName: string;
  Verizon?: number;
  TMobile?: number;
}

interface DimensionComparisonTableProps {
  data: DimensionComparisonData[];
  showCompetitors?: boolean;
  connected?: boolean;
}

const DimensionComparisonTable: React.FC<DimensionComparisonTableProps> = ({ 
  data, 
  showCompetitors = false,
  connected = false
}) => {
  // Sort by absolute delta value to highlight biggest differences
  const sortedData = [...data].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  
  // Function to determine the best competitor for a given dimension
  const getBestCompetitor = (item: DimensionComparisonData) => {
    const competitors = [
      { name: 'AT&T', value: item.att },
      { name: 'Verizon', value: item.Verizon },
      { name: 'T-Mobile', value: item.TMobile }
    ].filter(comp => comp.value !== undefined);
    
    return competitors.reduce((best, current) => 
      (current.value !== undefined && current.value > best.value) ? current : best, 
      competitors[0]
    );
  };

  // Table content to be used in both modes (connected or standalone)
  const tableContent = (
    <>
      <div className="pb-2">
        <h3 className="text-lg font-medium">
          {showCompetitors ? "Competitor Comparison" : "Industry Comparison"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {showCompetitors 
            ? "AT&T vs. major competitors" 
            : "AT&T vs. Telecom industry averages"}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dimension</TableHead>
            {showCompetitors ? (
              <>
                <TableHead className="text-right">AT&T</TableHead>
                <TableHead className="text-right">Verizon</TableHead>
                <TableHead className="text-right">T-Mobile</TableHead>
                <TableHead className="text-right">Best</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-right">Industry</TableHead>
                <TableHead className="text-right">AT&T</TableHead>
                <TableHead className="text-right">Delta</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => {
            const bestCompetitor = showCompetitors ? getBestCompetitor(item) : null;
            
            return (
              <TableRow key={item.dimension}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.dimension}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-40" title={item.fullName}>
                      {item.fullName}
                    </span>
                  </div>
                </TableCell>

                {showCompetitors ? (
                  <>
                    <TableCell 
                      className={`text-right ${bestCompetitor?.name === 'AT&T' ? 'font-bold text-green-600' : ''}`}
                    >
                      {item.att.toFixed(1)}
                    </TableCell>
                    <TableCell 
                      className={`text-right ${bestCompetitor?.name === 'Verizon' ? 'font-bold text-green-600' : ''}`}
                    >
                      {item.Verizon?.toFixed(1) || 'N/A'}
                    </TableCell>
                    <TableCell 
                      className={`text-right ${bestCompetitor?.name === 'T-Mobile' ? 'font-bold text-green-600' : ''}`}
                    >
                      {item.TMobile?.toFixed(1) || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {bestCompetitor?.name}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="text-right">{item.industry.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{item.att.toFixed(1)}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-1">
                      <span
                        className={
                          item.delta > 0
                            ? "text-green-600"
                            : item.delta < 0
                            ? "text-red-600"
                            : ""
                        }
                      >
                        {item.delta > 0 && "+"}
                        {item.delta.toFixed(1)}
                      </span>
                      {item.delta > 0 ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                      ) : item.delta < 0 ? (
                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                      ) : null}
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );

  // Return connected mode (no Card wrapper) or standard Card mode
  if (connected) {
    return tableContent;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {showCompetitors ? "Competitor Comparison" : "Industry Comparison"}
        </CardTitle>
        <CardDescription>
          {showCompetitors 
            ? "AT&T vs. major competitors" 
            : "AT&T vs. Telecom industry averages"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dimension</TableHead>
              {showCompetitors ? (
                <>
                  <TableHead className="text-right">AT&T</TableHead>
                  <TableHead className="text-right">Verizon</TableHead>
                  <TableHead className="text-right">T-Mobile</TableHead>
                  <TableHead className="text-right">Best</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-right">Industry</TableHead>
                  <TableHead className="text-right">AT&T</TableHead>
                  <TableHead className="text-right">Delta</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              const bestCompetitor = showCompetitors ? getBestCompetitor(item) : null;
              
              return (
                <TableRow key={item.dimension}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{item.dimension}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-40" title={item.fullName}>
                        {item.fullName}
                      </span>
                    </div>
                  </TableCell>

                  {showCompetitors ? (
                    <>
                      <TableCell 
                        className={`text-right ${bestCompetitor?.name === 'AT&T' ? 'font-bold text-green-600' : ''}`}
                      >
                        {item.att.toFixed(1)}
                      </TableCell>
                      <TableCell 
                        className={`text-right ${bestCompetitor?.name === 'Verizon' ? 'font-bold text-green-600' : ''}`}
                      >
                        {item.Verizon?.toFixed(1) || 'N/A'}
                      </TableCell>
                      <TableCell 
                        className={`text-right ${bestCompetitor?.name === 'T-Mobile' ? 'font-bold text-green-600' : ''}`}
                      >
                        {item.TMobile?.toFixed(1) || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {bestCompetitor?.name}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-right">{item.industry.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{item.att.toFixed(1)}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <span
                          className={
                            item.delta > 0
                              ? "text-green-600"
                              : item.delta < 0
                              ? "text-red-600"
                              : ""
                          }
                        >
                          {item.delta > 0 && "+"}
                          {item.delta.toFixed(1)}
                        </span>
                        {item.delta > 0 ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-600" />
                        ) : item.delta < 0 ? (
                          <ArrowDownIcon className="h-4 w-4 text-red-600" />
                        ) : null}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DimensionComparisonTable;
