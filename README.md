Of course. Here is a comprehensive README file for your project.

-----

# Video Thumbnail A/B Testing with Next.js, Cloudinary, and PostHog

This project is a complete, full-stack application that demonstrates how to programmatically A/B test video thumbnails. It uses Cloudinary for on-the-fly image transformations, PostHog for event tracking and analysis, and Next.js with shadcn/ui for the front-end.

## Features

  - **Dynamic Thumbnail Generation**: Generates multiple thumbnail variations from a single video source using Cloudinary's URL transformations.
  - **Client-Side A/B Testing**: Randomly assigns users to "Variant A" or "Variant B" on the client-side to ensure fair testing.
  - **Full Analytics Funnel**: Tracks key user interactions (`thumbnail_impression`, `thumbnail_clicked`, `video_played`) with PostHog.
  - **Custom Analytics Dashboard**: A dedicated page (`/analytics`) that securely fetches and displays A/B test results directly from the PostHog API.
  - **Responsive Video Playback**: Uses the Cloudinary Video Player in a responsive modal for a seamless viewing experience.
  - **Modern UI**: Built with Next.js, Tailwind CSS, and shadcn/ui, including a responsive header, footer, and a dark/light mode toggle.
  - **Server-Side API**: Includes a Next.js API route to proxy PostHog events and another to securely query analytics data using HogQL.

-----

## Tech Stack

  - **Framework**: [Next.js](https://nextjs.org/) (App Router)
  - **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
  - **Media Management**: [Cloudinary](https://cloudinary.com/) (URL-Gen SDK & Video Player)
  - **Analytics**: [PostHog](https://posthog.com/)
  - **Deployment**: Vercel (recommended)

-----

## Getting Started

Follow these instructions to set up and run the project locally.

### 1\. Prerequisites

  - Node.js (v18 or later)
  - npm or yarn
  - A Cloudinary account
  - A PostHog account

### 2\. Installation

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/cloudinary-ab-test.git
cd cloudinary-ab-test
npm install
```

### 3\. Environment Variables

Create a `.env.local` file in the root of your project and add the following variables.

```
# .env.local

# Cloudinary (Find in your dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

# PostHog (Public key for sending events)
NEXT_PUBLIC_POSTHOG_KEY=YOUR_PUBLIC_CLIENT_KEY
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com # Or your regional host
NEXT_PUBLIC_POSTHOG_UI_HOST=https://us.posthog.com # Or your regional host

# PostHog (Secret key for fetching analytics on the server)
# Go to Settings > Personal API Keys to generate this
POSTHOG_API_KEY=YOUR_PERSONAL_API_KEY
```

### 4\. Update Project ID

In the analytics API route, you must set your PostHog Project ID.

  - Open `app/api/analytics/route.ts`.
  - Find the line `const POSTHOG_PROJECT_ID = 'YOUR_PROJECT_ID';` and replace it with your actual ID. You can find this in your PostHog project URL (`/project/12345/`).

### 5\. Run the Development Server

Start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

  - The main page (`/`) shows the A/B test.
  - The analytics dashboard is available at (`/analytics`).

-----

## PostHog Funnel Setup

To visualize your A/B test results on your PostHog dashboard, create a **Funnel** insight with the following configuration:

1.  **Step 1**: Event `thumbnail_impression`
2.  **Step 2**: Event `thumbnail_clicked`
3.  **Breakdown by**: Property `variant`

This will create a chart that directly compares the click-through rate of Variant A vs. Variant B.