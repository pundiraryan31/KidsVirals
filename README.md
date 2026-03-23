# KidsViral AI — Full-Stack YouTube Growth Agent

> A production-ready full-stack web app that runs your entire kids YouTube channel pipeline — from AI-powered idea generation to SEO-optimized upload — powered by the Anthropic Claude API.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, CSS Variables             |
| Backend   | Node.js 18, Express 4               |
| AI Engine | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Streaming | Server-Sent Events (SSE)            |
| Deploy    | Vercel / Netlify / Docker           |

---

## Project Structure

```
kidsviral-ai/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── services/
│   │   └── ai.js              # Anthropic SDK wrapper
│   ├── routes/
│   │   ├── ideas.js           # POST /api/ideas/generate
│   │   ├── scripts.js         # POST /api/scripts/generate + /hook
│   │   ├── titles.js          # POST /api/titles/generate
│   │   ├── seo.js             # POST /api/seo/generate
│   │   ├── analytics.js       # GET /api/analytics/mock + improve
│   │   ├── pipeline.js        # POST /api/pipeline/run (SSE stream)
│   │   └── chat.js            # POST /api/chat/message
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── App.js             # Root component + routing state
│   │   ├── index.js           # React entry point
│   │   ├── index.css          # Full design system (dark theme)
│   │   ├── utils/
│   │   │   └── api.js         # All backend API calls
│   │   ├── components/
│   │   │   └── index.js       # Sidebar, Topbar, shared UI
│   │   └── pages/
│   │       ├── Dashboard.js   # Stats, pipeline status, schedule
│   │       ├── IdeasPage.js   # AI idea generation with filters
│   │       ├── ScriptPage.js  # Full script + hooks generator
│   │       ├── TitlesPage.js  # CTR titles + thumbnail concepts
│   │       ├── SeoPage.js     # Description, tags, upload sim
│   │       ├── AnalyticsPage.js # Charts, retention, AI strategy
│   │       ├── PipelinePage.js  # One-click pipeline with SSE log
│   │       └── ChatPage.js    # Multi-turn AI assistant chat
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── package.json               # Monorepo scripts
├── docker-compose.yml
├── vercel.json
├── netlify.toml
└── .gitignore
```

---

## Quick Start (Local Dev)

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### 1 — Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/kidsviral-ai.git
cd kidsviral-ai
npm run install:all
```

### 2 — Configure Environment
```bash
cp backend/.env.example backend/.env
# Then edit backend/.env and set:
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3 — Run Dev Servers
```bash
# Install concurrently first (for the root)
npm install

# Start both backend (port 5000) and frontend (port 3000)
npm run dev
```

Open **http://localhost:3000** — the frontend proxies `/api/*` to the backend automatically.

---

## API Reference

All endpoints return `{ success: true, ...data }` or `{ success: false, error: string }`.

### Ideas
```
POST /api/ideas/generate
Body: { genre, emotion, format, keywords, count }
Returns: { ideas: [{ title, logline, hook, viralScore, tags, seriesPotential, emotionalCore }] }

POST /api/ideas/trending
Returns: { trending: [{ theme, reason, urgencyScore }] }
```

### Scripts
```
POST /api/scripts/generate
Body: { title, characters, targetLength, endingType, genre, episodeNumber }
Returns: { script: { title, episode, scenes: [...], endCard, productionNotes } }

POST /api/scripts/hook
Body: { title, genre }
Returns: { hooks: [{ hook, style, estimatedCTR }] }
```

### Titles
```
POST /api/titles/generate
Body: { concept, genre }
Returns: { titles: [{ title, ctrScore, triggerWords, reason }], thumbnailTexts, recommendedIndex }
```

### SEO
```
POST /api/seo/generate
Body: { title, concept, genre, episode }
Returns: { description, tags, pinnedComment, chapters, endScreenCTA }
```

### Analytics
```
GET  /api/analytics/mock
Returns: { channel, dailyViews, retentionCurve, topVideos, uploadSchedulePerformance }

POST /api/analytics/improve
Body: { avgRetention, avgCTR, topThemes, dropOffPoint }
Returns: { strategy: { retentionFix, ctrFix, contentStrategy, seriesRecommendation, uploadAdvice } }
```

### Pipeline (SSE Streaming)
```
POST /api/pipeline/run
Body: { genre, emotion, keywords }
Returns: text/event-stream
  data: { step: number, message: string, data: object | null }
```

### Chat
```
POST /api/chat/message
Body: { message, history: [{ role, content }] }
Returns: { reply: string, usage: object }
```

---

## Deployment

### Option A — Vercel (Recommended, Free)

```bash
# Install Vercel CLI
npm i -g vercel

# From project root
vercel

# Set environment variable in Vercel dashboard:
# ANTHROPIC_API_KEY = your key
# Or via CLI:
vercel env add ANTHROPIC_API_KEY
```

The `vercel.json` routes `/api/*` to the Express backend and `/*` to the React build.

### Option B — Netlify

```bash
npm i -g netlify-cli
netlify init
netlify env:set ANTHROPIC_API_KEY your_key_here
netlify deploy --prod
```

### Option C — Docker Compose (Self-Hosted / VPS)

```bash
# Create .env file at project root
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

# Build and run
docker-compose up --build -d

# App is live at http://localhost:3000
# Backend at http://localhost:5000
```

### Option D — Manual VPS (Ubuntu/Debian)

```bash
# Install Node 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and build
git clone https://github.com/YOUR_USERNAME/kidsviral-ai.git
cd kidsviral-ai
npm run install:all
npm run build   # builds React frontend into frontend/build/

# Set env vars
export ANTHROPIC_API_KEY=your_key_here
export NODE_ENV=production
export FRONTEND_URL=https://yourdomain.com

# Serve (Express serves the React build in production)
npm start

# Use PM2 for process management
npm i -g pm2
pm2 start backend/server.js --name kidsviral
pm2 save
pm2 startup
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Required | Default                   | Description                        |
|-------------------|----------|---------------------------|------------------------------------|
| `ANTHROPIC_API_KEY` | ✅ Yes  | —                         | Your Anthropic API key             |
| `PORT`            | No       | `5000`                    | Backend server port                |
| `FRONTEND_URL`    | No       | `http://localhost:3000`   | Allowed CORS origin                |
| `NODE_ENV`        | No       | `development`             | `development` or `production`      |

### Frontend

| Variable              | Required | Description                        |
|-----------------------|----------|------------------------------------|
| `REACT_APP_API_URL`   | No       | Backend URL (empty = use proxy)    |

---

## Features

| Feature | Description |
|---|---|
| **Ideas Engine** | Generates 5 AI-powered viral concepts, filterable by genre, emotion, and format |
| **Script Writer** | Full 6-scene scripts with narration, dialogue, SFX, and visual cues |
| **Hook Generator** | 5 hook variations per video with CTR rating |
| **Titles & Thumbnails** | 3 CTR-optimized titles + thumbnail concept previews with text overlays |
| **SEO Package** | Full YouTube description, 15–20 tags, pinned comment, video chapters |
| **Upload Checklist** | 7-step animated upload simulation |
| **Analytics Dashboard** | Channel stats, retention curve, daily views chart, top videos |
| **AI Strategy** | Personalized improvement advice based on analytics |
| **Pipeline (SSE)** | One-click full daily workflow with real-time streaming log |
| **AI Chat** | Multi-turn Claude conversation with chat history context |

---

## Rate Limiting

The backend applies a rate limit of **20 requests per minute** on all AI endpoints to protect your API budget. Adjust in `server.js`:

```js
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,   // ← change this
});
```

---

## Content Strategy Built In

The app ships with the optimal upload strategy for the **Indian kids YouTube market**:

- **Best days:** Friday, Saturday, Sunday
- **Best times:** 5:00 PM IST (weekdays) · 10:30 AM IST (weekends)
- **Target length:** 5–7 minutes (YouTube Kids algorithm sweet spot)
- **Cut pace:** New visual every 2–3 seconds (under-10 attention span)
- **Series depth:** 8 episodes per series (drives subscribe + binge loop)

---

## License

MIT — free to use, modify, and deploy for personal or commercial use.

---

*Built with Node.js · React · Anthropic Claude · KidsViral AI v2.0*
