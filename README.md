# DevPulse 

A real-time developer activity dashboard that tracks project stats, team activity, and coding metrics — all in one place.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- Zustand (state management)
- Socket.IO Client (real-time updates)
- Recharts (data visualization)
- React Router v7
- Axios

**Backend**
- Node.js + Express 5
- PostgreSQL (via `pg`)
- Redis (via `ioredis`) — session/token storage
- Socket.IO — real-time event broadcasting
- JWT authentication (access + refresh tokens)
- Winston logging, Helmet, rate limiting, Zod validation

---

## Project Structure

```
devpulse/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── layout/      # AppLayout, Header, Sidebar
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom React hooks (e.g. useSocket)
│   │   ├── services/        # API client, Socket.IO setup
│   │   └── store/           # Zustand stores (auth, etc.)
│   └── vite.config.js
│
└── server/                  # Express backend
    └── src/
        ├── controllers/     # Route handler logic
        ├── middleware/      # Auth middleware
        ├── routes/          # API route definitions
        ├── services/        # Redis service, etc.
        ├── sockets/         # Socket.IO event handlers
        ├── config/          # Database connection
        └── utils/           # Logger and helpers
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devpulse.git
cd devpulse
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/devpulse
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

### 3. Set up the client

```bash
cd client
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the server at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get tokens | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/auth/logout` | Logout (invalidate token) | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/stats` | Get coding stats | ✅ |
| GET | `/api/projects` | List projects | ✅ |
| GET | `/api/activity` | Get activity feed | ✅ |
| GET | `/api/users` | List users | ✅ |
| GET | `/health` | Server health check | ❌ |

---

## Features

- **Real-time activity feed** via WebSockets
- **JWT authentication** with access + refresh token rotation
- **Redis-backed** session management
- **Rate limiting** (100 req / 15 min per IP)
- **Stats dashboard** with charts (Recharts)
- **Project tracking** with per-project metrics
- Responsive UI with Tailwind CSS

---

## Scripts

### Server
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start in production mode |

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `NODE_ENV` | `development` or `production` |

---

## License

MIT
