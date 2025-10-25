# How to A/B Test Video Thumbnails Programmatically with Cloudinary, PostHog, and Next.js

### Introduction

The single most critical factor determining if your video gets watched isn't the content—it's the thumbnail. It's the digital handshake, the movie poster, and the book cover all rolled into one. A compelling thumbnail can make a video go viral, while a poor one guarantees it will be ignored. But which one works best? The one with the bright text overlay, or the simple, clean frame?

Guessing is a losing game, and manual testing is slow and inefficient. You're leaving engagement and views on the table.

In this guide, we'll replace guesswork with data. We’ll build a powerful, automated A/B testing pipeline using **Next.js**, **Cloudinary** for dynamic media generation, and **PostHog** for robust analytics. You'll learn how to programmatically serve different thumbnail variants to users, track every interaction, and build a custom dashboard to confidently declare a winner based on a simple, powerful metric: the click-through rate (CTR).

- **Live Demo:** [cloudinary-video-thumbnails-ab-test.vercel.app](https://cloudinary-video-thumbnails-ab-test.vercel.app/)
- **GitHub Repo:** [github.com/musebe/cloudinary-video_thumbnails_ab-testing](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing)

Ready to make data-driven decisions? Let's get started.

### What You’ll Need and How It Works

Before we start building, let's make sure you have the essentials ready.

- **Node.js v18+** installed on your machine.
- A free **Cloudinary account** for media storage and transformations.
- A free **PostHog account** for event tracking and analytics.
- Basic knowledge of **Next.js**, including the App Router.

Our project works by combining these three powerful tools, each with a specific job:

1. Next.js (The Foundation)
    
    Next.js handles our entire application, from the frontend UI to the server-side logic. We’ll use it to build the thumbnail component, create secure API routes that talk to PostHog, and render everything efficiently.
    
2. Cloudinary (The Media Engine)
    
    Cloudinary manages our video and, more importantly, generates our A/B test thumbnail variants on the fly. It allows us to apply transformations—like a text overlay—to create "Variant B" from the same source video as "Variant A," all through a simple URL change.
    
3. PostHog (The Scorekeeper)
    
    PostHog is our analytics brain. It tracks how users interact with each thumbnail, helping us measure the events that matter: impressions (a thumbnail is shown), clicks (it gets clicked), and plays (the video starts). We'll later query this data with its HogQL API to see which variant performs better.
    

With these tools in place, we're ready to build a system that connects them into a fully functional A/B test.

### Why Not Cloudinary Analytics? A Tale of Two Tools

[Cloudinary Video Analytics](https://cloudinary.com/documentation/video_analytics) provides powerful, media-centric insights into how your videos perform *after* the play button is hit. It's excellent for tracking metrics like:

- **Views**: How many times your video is watched.
- **Engagement**: How long viewers stay and where they drop off.
- **Playback Quality**: Technical details like buffering, bitrate, and resolution changes.

These insights are invaluable for understanding video delivery, performance, and audience retention. But our A/B test is focused on what happens *before* the click—the decision-making moment. That’s where PostHog shines.

With PostHog, we can track the specific user journey leading up to the play event:

- Capture **custom events** like `thumbnail_impression` and `thumbnail_clicked`.
- Measure the **click-through rate (CTR)** between our A and B variants.
- Use **HogQL** (PostHog’s SQL-style query tool) to build a custom analytics dashboard.
- Create **funnels** to visualize how many impressions convert into clicks, and then into plays.

In this project, Cloudinary and PostHog work as a perfect team:

- **Cloudinary** handles the video delivery and dynamic thumbnail generation.
- **PostHog** tracks the user behavior that tells us *why* they chose to play the video in the first place.

### Step 1: Setting Up the Next.js Project

First, let’s lay the groundwork for our application. We’ll start fresh with a new **Next.js** project and use **shadcn/ui** to build a clean interface quickly. We’ll also bring in libraries like **Tailwind CSS**, **Lucide Icons**, and **Cloudinary’s SDKs** as seen in the codebase.

### 1. Create the Next.js App

Open your terminal and run this command to create the app with TypeScript and Tailwind CSS:

```bash
npx create-next-app@latest cloudinary-ab-test
```

Accept the defaults when prompted. This gives you the standard project structure with everything you need to start coding.

### 2. Initialize shadcn/ui

Now, let’s set up **shadcn/ui**, a lightweight component system built on top of Tailwind. It helps us avoid the bulk of traditional UI libraries while keeping full design control.

```bash
npx shadcn@latest init
```

Accept the default options. You can add UI components like `Card`, `Dialog`, `Table`, `Alert`, and `Badge` whenever you need them using this command:

```bash
npx shadcn@latest add card dialog table alert badge
```

These are the same components used in the project files such as `app/page.tsx`, `app/analytics/page.tsx`, and the custom `ABTestThumbnail` component.

### 3. Install Extra Dependencies

You’ll also need a few more packages used throughout the project:

```bash
npm install posthog-js @cloudinary/react @cloudinary/url-gen
```

These include:

- **posthog-js** for event tracking.
- **@cloudinary/react** and **@cloudinary/url-gen** for video and thumbnail generation.
- **lucide-react** for icons in the UI (like the play button and chart icons).

### 4. Configure Your Environment Variables

This step connects your app to **Cloudinary** and **PostHog**.

Create a new file named `.env.local` in the root of your project and add the following keys:

```
# .env.local

# Cloudinary (Find these in your Cloudinary dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

# PostHog (Public key for sending client events)
NEXT_PUBLIC_POSTHOG_KEY=YOUR_PUBLIC_CLIENT_KEY
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com # Or your regional host

# PostHog (Secret key for server analytics queries)
POSTHOG_API_KEY=YOUR_PERSONAL_API_KEY
```

This setup keeps your API keys private and prepares your app for backend analytics.

With the environment and base app ready, we can now move on to generating **dynamic thumbnail variants** with Cloudinary.

### Step 2: Generating Thumbnails with Cloudinary

Now that your project is set up, let’s build the heart of the A/B test, dynamic video thumbnails using **Cloudinary**.

Cloudinary lets you transform media on the fly using **URL-based transformations**. This means you can generate multiple thumbnail styles from the same video without uploading extra files.

### 1. Configure the Cloudinary SDK

Create a helper file to manage your Cloudinary setup:

```tsx
// lib/cloudinary.ts
import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});
```

This gives you a reusable instance of Cloudinary’s client that can create image and video transformations anywhere in your app.

### 2. Create Two Thumbnail Variants

In the component `ABTestThumbnail.tsx`, two different thumbnails are generated from the same video source:

- **Variant A:** A clean, unedited thumbnail.
- **Variant B:** A version with a “New Episode!” overlay and dark gradient.

Here’s a simplified version of how that’s built:

```tsx
const thumbnailA = cld
  .video(videoPublicId)
  .resize(fill().width(1280).height(720))
  .roundCorners(byRadius(15))
  .addTransformation("so_2,f_jpg,q_auto");

const thumbnailB = cld
  .video(videoPublicId)
  .resize(fill().width(1280).height(720))
  .roundCorners(byRadius(15))
  .addTransformation(
    "l_text:Arial_60_bold:New%20Episode!,co_rgb:FFFFFF,b_rgb:00000090/fl_layer_apply,g_south_east,x_20,y_20/so_8,f_jpg,q_auto"
  );
```

Each variant uses Cloudinary’s **URL transformation API** to apply effects, cropping, rounding, overlays, and quality adjustments.

### 3. Display and Track the Thumbnails

The app randomly assigns users to one of the variants using a simple randomizer and logs an impression event to PostHog:

```tsx
const assigned = Math.random() < 0.5 ? "A" : "B";
posthog.capture("thumbnail_impression", { video_id, variant: assigned });
```

When the user clicks the thumbnail, a second event is logged — `thumbnail_clicked`.

This lightweight setup allows Cloudinary to handle visuals while PostHog captures real engagement data.

You can view the full component code here: [**ABTestThumbnail Component**](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/components/ABTestThumbnail.tsx)

### Step 3: Tracking User Events with PostHog

Now that your thumbnails are ready, let’s connect **PostHog** to track how users interact with them. This allows you to measure which variant attracts more clicks and views.

### 1. Initialize PostHog

You’ll use a provider file to load PostHog on the client side. This keeps analytics lightweight and avoids server-side errors.

```tsx
// app/providers.tsx
'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    person_profiles: 'always',
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

```

This file ensures PostHog only runs in the browser. The `api_host` points to a custom proxy route that you’ll create next.

Full file:  [**app/providers.tsx on GitHub**](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/app/providers.tsx)

### 2. Proxy PostHog Requests

Instead of sending data directly to PostHog’s public API, you’ll use your own Next.js route as a secure proxy.

```tsx
// app/ingest/[[...path]]/route.ts
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export async function POST(request: Request) {
  const payload = await request.text();
  const response = await fetch(POSTHOG_HOST!, {
    method: 'POST',
    headers: request.headers,
    body: payload,
  });
  return new Response(await response.text(), { status: response.status });
}

```

This keeps your host URL private and helps avoid browser CORS issues.

Full file: [**app/ingest/[[...path]]/route.ts on GitHub**](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/app/ingest/%5B%5B...path%5D%5D/route.ts)

### 3. Track Key Events

Once PostHog is set up, start tracking the main actions:

- `thumbnail_impression` when a thumbnail appears.
- `thumbnail_clicked` when a user selects it.
- `video_played` when the video starts.

Example snippet:

```tsx
posthog.capture("thumbnail_clicked", {
  video_id: videoPublicId,
  variant,
});
```

These events will appear in your PostHog dashboard immediately. You can then analyze click-through rates, funnels, and trends for each thumbnail variant.

### Step 4: Building the A/B Logic

Now that PostHog is active, it’s time to wire up the logic that powers the actual A/B test. This is where your app randomly assigns a user to **Variant A** or **Variant B** and tracks their interactions.

### 1. Create the A/B Test Component

The A/B logic lives inside the [`ABTestThumbnail`](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/components/ABTestThumbnail.tsx) component.

It performs three main tasks:

- Randomly assigns users a thumbnail variant.
- Displays the correct image using Cloudinary transformations.
- Captures impression and click events with PostHog.

Here’s the key part of the logic:

```tsx
const [variant, setVariant] = (useState < string) | (null > null);

useEffect(() => {
  const assigned = Math.random() < 0.5 ? "A" : "B";
  setVariant(assigned);
  posthog.capture("thumbnail_impression", {
    video_id: videoPublicId,
    variant: assigned,
  });
}, []);

const handleClick = () => {
  if (!variant) return;
  posthog.capture("thumbnail_clicked", {
    video_id: videoPublicId,
    variant,
  });
  const thumbnailUrl = variants[variant].toURL();
  onThumbnailClick(thumbnailUrl);
};
```

This code randomly assigns the user to a variant, logs the first view, and sends a click event when they engage.

### 2. Generate Visual Variants

The component uses **Cloudinary’s transformation API** to create two thumbnail styles dynamically:

- **Variant A:** Plain version.
- **Variant B:** Version with a text overlay (“New Episode!”).

Example:

```tsx
const thumbnailB = cld
  .video(videoPublicId)
  .resize(fill().width(1280).height(720))
  .roundCorners(byRadius(15))
  .addTransformation(
    "l_text:Arial_60_bold:New%20Episode!,co_rgb:FFFFFF,b_rgb:00000090/fl_layer_apply,g_south_east,x_20,y_20/so_8,f_jpg,q_auto"
  );
```

Each user sees only one variant per session, giving you clean, unbiased data.

### 3. Display the Variant

The thumbnail is displayed inside a styled card built with **shadcn/ui** components. It uses the `AdvancedImage` component from `@cloudinary/react` for optimized image rendering and lazy loading.

You can explore the complete code here:  [**ABTestThumbnail Component on GitHub**](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/components/ABTestThumbnail.tsx)

With A/B assignment and tracking complete, we can now measure how each variant performs using analytics.

### Step 5: Creating the Analytics Dashboard

Once your app collects events from PostHog, you need a way to view results. The analytics dashboard does exactly that. It fetches event data from PostHog’s API and shows how each thumbnail variant performs.

### 1. Build the Analytics API Route

The logic for fetching A/B test data lives inside [`app/api/analytics/route.ts`](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/app/api/analytics/route.ts).

It uses PostHog’s **HogQL API** to query recent events:

```tsx
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

```

This query counts impressions and clicks for both variants over the past seven days.

The API route then structures the data for the frontend:

```tsx
const results = {
  A: { impressions: 0, clicks: 0 },
  B: { impressions: 0, clicks: 0 },
};
```

The endpoint returns this JSON format to the analytics page.

### 2. Create the Analytics Page

The results are displayed on [`app/analytics/page.tsx`](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/app/analytics/page.tsx).

It fetches data from the API and renders a clean results table using `shadcn/ui` components like `Card`, `Table`, and `Alert`.

Here’s the key rendering logic:

```tsx
<TableBody>
  <TableRow>
    <TableCell>Variant A</TableCell>
    <TableCell>{results?.A.impressions ?? 0}</TableCell>
    <TableCell>{results?.A.clicks ?? 0}</TableCell>
    <TableCell>
      {calculateCTR(results?.A.clicks ?? 0, results?.A.impressions ?? 0)}
    </TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Variant B</TableCell>
    <TableCell>{results?.B.impressions ?? 0}</TableCell>
    <TableCell>{results?.B.clicks ?? 0}</TableCell>
    <TableCell>
      {calculateCTR(results?.B.clicks ?? 0, results?.B.impressions ?? 0)}
    </TableCell>
  </TableRow>
</TableBody>;
```

Each variant’s **CTR (Click-Through Rate)** is calculated and displayed clearly.

### 3. View and Compare Results

When you open `/analytics`, the dashboard loads data automatically. You’ll see:

- Impressions and clicks for each variant.
- Calculated CTR to show which one performs better.

This gives you real, measurable results to guide your creative decisions.

You can view the full files here:

- [**Analytics API Route**](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/app/api/analytics/route.ts)
- [**Analytics Page**](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing/blob/main/app/analytics/page.tsx)

### Step 6: Running the Experiment

Your app is ready. The thumbnails load, events track, and analytics display in real time. Now it’s time to run your experiment and interpret the data.

### 1. Deploy the App

Deploy to [**Vercel**](http://vercel.com) for the best performance and easy environment management.

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

Use the same keys from your `.env.local` file.

Once deployed, visit your site and confirm that:

- The thumbnails load correctly.
- PostHog events appear in your PostHog dashboard under “Events.”
- The `/analytics` page fetches and displays data.

Live demo:  [**cloudinary-video-thumbnails-ab-test.vercel.app**](https://cloudinary-video-thumbnails-ab-test.vercel.app/)

### 2. Test User Flow

Open your site in a few browsers or incognito windows to simulate different users.

Each session randomly receives **Variant A** or **Variant B**.

Try the following actions:

- Refresh the page to generate new thumbnail impressions.
- Click each thumbnail a few times.
- Watch the video briefly.

Then, check your PostHog dashboard. You should see events like:

- `thumbnail_impression`
- `thumbnail_clicked`
- `video_played`

### 3. Analyze Click-Through Rate (CTR)

Visit your `/analytics` page to see how both variants perform.

Example result:

| Variant | Impressions | Clicks | CTR |
| --- | --- | --- | --- |
| A | 42 | 10 | 23.8% |
| B | 36 | 15 | 41.6% |

In this example, **Variant B** performs better, so you’d keep that design for future videos.

### 4. Scale the Test

Once your pipeline works, you can:

- Add more variants using additional Cloudinary transformations.
- Extend event tracking to include engagement depth (watch time).
- Connect results to your internal dashboards using PostHog’s API.

This workflow can scale easily across hundreds of thumbnails and campaigns.

You now have a working, measurable A/B testing system that connects **Cloudinary’s media power** with **PostHog’s event analytics**.

### Conclusion

You’ve built a full A/B testing system that helps you make smarter creative decisions. With **Cloudinary** and **PostHog**, you can now see both sides of viewer behavior—how your media looks and how users react to it.

**Cloudinary** handles everything visual:

- Generates high-quality thumbnails in real time.
- Streams optimized videos with the Cloudinary Video Player.
- Tracks playback and delivery through [Video Analytics](https://cloudinary.com/documentation/video_analytics).

**PostHog** handles user behavior:

- Tracks impressions, clicks, and plays.
- Lets you run A/B tests and query results easily.
- Displays real-time funnels for your engagement data.

This combination gives you a complete loop:

- **Cloudinary** shows *what* users see.
- **PostHog** shows *what* they do next.

You now have a clear process to test, measure, and improve your video thumbnails at scale.

**See the full code:**  [github.com/musebe/cloudinary-video_thumbnails_ab-testing](https://github.com/musebe/cloudinary-video_thumbnails_ab-testing)

**Live demo:** [cloudinary-video-thumbnails-ab-test.vercel.app](https://cloudinary-video-thumbnails-ab-test.vercel.app/)