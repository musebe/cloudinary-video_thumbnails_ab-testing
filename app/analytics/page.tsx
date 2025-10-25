'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, AlertCircle, BarChart2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateCTR = (clicks: number, impressions: number) =>
    impressions === 0
      ? '0.00%'
      : `${((clicks / impressions) * 100).toFixed(2)}%`;

  // Loading State
  if (isLoading) {
    return (
      <main className='flex h-[60vh] items-center justify-center'>
        <div className='flex items-center gap-3 text-muted-foreground'>
          <Loader2 className='h-5 w-5 animate-spin' />
          <span>Loading analytics...</span>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className='flex h-[60vh] items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error loading data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className='container mx-auto max-w-4xl p-6 md:p-10'>
      <Card className='shadow-sm'>
        <CardHeader className='flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <BarChart2 className='h-5 w-5 text-primary' />
            <CardTitle className='text-lg md:text-xl font-semibold'>
              A/B Test Results
            </CardTitle>
          </div>
          <CardDescription className='text-sm text-muted-foreground'>
            Tracking impressions and clicks for each thumbnail variant.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className='mt-4'>
          <div className='overflow-x-auto rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[120px]'>Variant</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='font-medium'>Variant A</TableCell>
                  <TableCell>{results?.A.impressions ?? 0}</TableCell>
                  <TableCell>{results?.A.clicks ?? 0}</TableCell>
                  <TableCell className='font-semibold text-primary'>
                    {calculateCTR(
                      results?.A.clicks ?? 0,
                      results?.A.impressions ?? 0
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Variant B</TableCell>
                  <TableCell>{results?.B.impressions ?? 0}</TableCell>
                  <TableCell>{results?.B.clicks ?? 0}</TableCell>
                  <TableCell className='font-semibold text-primary'>
                    {calculateCTR(
                      results?.B.clicks ?? 0,
                      results?.B.impressions ?? 0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
