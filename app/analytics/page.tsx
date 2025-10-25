// app/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AnalyticsData {
  impressions: number;
  clicks: number;
}

interface Results {
  A: AnalyticsData;
  B: AnalyticsData;
}

export default function AnalyticsPage() {
  const [results, setResults] = useState<Results | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) {
      return '0.00%';
    }
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  if (isLoading) {
    return <div className='p-8'>Loading analytics...</div>;
  }

  if (error) {
    return <div className='p-8 text-red-500'>Error: {error}</div>;
  }

  return (
    <main className='p-8'>
      <Card>
        <CardHeader>
          <CardTitle>A/B Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variant</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Click-Through Rate (CTR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Variant A</TableCell>
                <TableCell>{results?.A.impressions}</TableCell>
                <TableCell>{results?.A.clicks}</TableCell>
                <TableCell>
                  {calculateCTR(
                    results?.A.clicks ?? 0,
                    results?.A.impressions ?? 0
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Variant B</TableCell>
                <TableCell>{results?.B.impressions}</TableCell>
                <TableCell>{results?.B.clicks}</TableCell>
                <TableCell>
                  {calculateCTR(
                    results?.B.clicks ?? 0,
                    results?.B.impressions ?? 0
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
