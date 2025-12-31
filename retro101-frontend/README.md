# retro101 Frontend

React + TypeScript frontend built with Vite.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on http://localhost:5173 with Hot Module Replacement.

## Environment Variables

Copy `.env.example` to `.env.development`:

```bash
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

For production, set these in Vercel dashboard.

## Build

```bash
npm run build
```

Output in `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Code Quality

```bash
# Run linter
npm run lint

# Format code
npx prettier --write src/
```

## Project Structure

```
src/
├── assets/          # Images, fonts, static files
├── components/      # Reusable React components
├── features/        # Feature modules (rooms, cards, etc)
├── hooks/           # Custom React hooks
├── services/        # API and WebSocket services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Root component
├── main.tsx         # Entry point
└── index.css        # Global styles with Tailwind directives
```

## Tech Stack

- **React:** 18+ with hooks and concurrent features
- **TypeScript:** 5.x with strict mode
- **Vite:** 6.x for fast HMR and builds
- **Tailwind CSS:** 3.4+ utility-first framework
- **WebSocket:** STOMP over SockJS for real-time updates

## Deployment

Deploys automatically to Vercel on push to `main` branch.

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist/`
- Framework Preset: Vite

**Environment Variables in Vercel:**
- `VITE_API_URL`: Railway backend URL
- `VITE_WS_URL`: Railway WebSocket URL (wss://)
