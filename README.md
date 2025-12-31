# retro101

Simple retrospectives for agile teams.

## Project Structure

- `retro101-frontend/` - React + TypeScript frontend (Vite)
- `retro101-backend/` - Spring Boot backend (Java 17)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.8+

### Frontend Setup

```bash
cd retro101-frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### Backend Setup

```bash
cd retro101-backend
mvn spring-boot:run
```

Backend runs on http://localhost:8080

## Environment Variables

### Frontend

Copy `.env.example` to `.env.development`:

```bash
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

### Backend

Spring Boot uses profile-based configuration:
- Development: `application-development.yml`
- Production: `application-production.yml` (uses environment variables)

See `retro101-backend/.env.example` for production variables.

## Deployment

- **Frontend:** Vercel (auto-deploy from main branch)
- **Backend:** Railway (auto-deploy from main branch)

## Tech Stack

### Frontend
- React 18+
- TypeScript 5.x
- Vite 6.x
- Tailwind CSS 3.4+
- WebSocket (STOMP over SockJS)

### Backend
- Spring Boot 3.x
- Java 17+
- Spring WebSocket
- Maven 3.8+

## Development

See individual README files in `retro101-frontend/` and `retro101-backend/` for more details.
