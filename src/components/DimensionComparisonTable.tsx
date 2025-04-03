
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
}

interface DimensionComparisonTableProps {
  data: DimensionComparisonData[];
}

const DimensionComparisonTable: React.FC<DimensionComparisonTableProps> = ({ data }) => {
  // Sort by absolute delta value to highlight biggest differences
  const sortedData = [...data].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Industry Comparison</CardTitle>
        <CardDescription>AT&T vs. Telecom industry averages</CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dimension</TableHead>
              <TableHead className="text-right">Industry</TableHead>
              <TableHead className="text-right">AT&T</TableHead>
              <TableHead className="text-right">Delta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.dimension}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.dimension}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-40" title={item.fullName}>
                      {item.fullName}
                    </span>
                  </div>
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DimensionComparisonTable;
