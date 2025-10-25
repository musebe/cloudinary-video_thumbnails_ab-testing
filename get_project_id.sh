#!/bin/bash

# An improved script to fetch your PostHog Project ID that includes error handling.

# --- Check for .env file ---
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found."
    exit 1
fi

# --- Read API Key from .env ---
API_KEY=$(grep "POSTHOG_API_KEY" .env | cut -d'=' -f2)

if [ -z "$API_KEY" ]; then
    echo "❌ Error: POSTHOG_API_KEY is not set in your .env file."
    exit 1
fi

echo "🔑 Found API Key. Fetching projects from PostHog..."
echo ""

# --- Call the PostHog API and store the response ---
API_RESPONSE=$(curl -s "https://us.posthog.com/api/projects/" \
     -H "Authorization: Bearer $API_KEY")

# --- Check if the response contains an error ---
if echo "$API_RESPONSE" | grep -q "detail"; then
    echo "❌ PostHog API Error:"
    echo "$API_RESPONSE" | jq .detail
    exit 1
fi

# --- If successful, process the JSON ---
echo "$API_RESPONSE" | jq '.results[] | {id, name}'

echo ""
echo "✅ Done. The 'id' above is your Project ID."