// app/ingest/[[...path]]/route.ts

import { NextResponse } from 'next/server'

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST

export async function POST(request: Request) {
    const requestHeaders = new Headers(request.headers)
    const payload = await request.text()

    if (!POSTHOG_HOST) {
        return NextResponse.json({ error: 'POSTHOG_HOST is not configured' }, { status: 500 })
    }

    try {
        const response = await fetch(POSTHOG_HOST, {
            method: 'POST',
            headers: requestHeaders,
            body: payload,
        })

        const responseHeaders = new Headers(response.headers)
        responseHeaders.set('Access-Control-Allow-Origin', '*')
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')

        const data = await response.text()
        return new Response(data, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch (error) {
        console.error('Error proxying to PostHog:', error)
        return NextResponse.json({ error: 'Error proxying to PostHog' }, { status: 500 })
    }
}