// app/api/analytics/route.ts
import { NextResponse } from 'next/server';

const POSTHOG_PROJECT_ID = '238716';
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export async function GET() {
    if (!POSTHOG_API_KEY || !POSTHOG_HOST) {
        return NextResponse.json({ error: 'PostHog server environment variables are not configured' }, { status: 500 });
    }

    try {
        const endpoint = `${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query`;

        const hogqlQuery = `
      SELECT 
        event,
        properties.variant as variant,
        count() as total
      FROM events
      WHERE 
        event IN ('thumbnail_impression', 'thumbnail_clicked') AND
        timestamp >= now() - INTERVAL 7 DAY
      GROUP BY event, variant
    `;

        // ✅ THE FIX: Wrap the query in the required object structure
        const requestBody = {
            query: {
                kind: 'HogQLQuery',
                query: hogqlQuery,
            },
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${POSTHOG_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            next: { revalidate: 60 },
        });

        const data = await response.json();

        if (!response.ok || !data.results) {
            console.error('Raw PostHog Error Response:', data);
            throw new Error(`PostHog API Error: ${data.detail || 'Invalid response structure'}`);
        }

        const results = {
            A: { impressions: 0, clicks: 0 },
            B: { impressions: 0, clicks: 0 },
        };

        data.results.forEach((row: [string, 'A' | 'B', number]) => {
            const [eventName, variantKey, count] = row;

            if (results[variantKey]) {
                if (eventName === 'thumbnail_impression') {
                    results[variantKey].impressions = count;
                } else if (eventName === 'thumbnail_clicked') {
                    results[variantKey].clicks = count;
                }
            }
        });

        return NextResponse.json(results);

    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
    }
}