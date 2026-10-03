# Storii — An Archive of Lived Experience

> **The lessons people only learn by living them.**  
> Storii is an editorial archive of first-hand lived experience: real lessons, quiet habits, and honest reflections on work, money, relationships, health, home, and learning.

---

## 🏛 Architecture Overview

Storii is structured as a clean, production-ready fullstack application:

```text
storii/
├── backend/                  # Production Node.js & Express REST API
│   ├── .env                  # Neon PostgreSQL, Google OAuth, and JWT secrets
│   ├── .env.example          # Environment variables template
│   ├── migrations/           # Database migration files (.sql)
│   │   └── 001_initial_schema.sql
│   ├── package.json
│   └── src/
│       ├── app.js            # Express app configuration, CORS, and route mounting
│       ├── server.js         # HTTP server entrypoint with auto-migration and auto-seed
│       ├── config/           # Centralized configuration (env.js)
│       ├── controllers/      # Route controllers (auth, questions, experiences, user, stats)
│       ├── db/               # PostgreSQL pool, migration runner (migrate.js), seed script (seed.js)
│       ├── middleware/       # JWT auth guards (requireAuth, optionalAuth) and error handler
│       ├── models/           # Data access models (User, Question, Experience)
│       └── routes/           # REST endpoints (/api/auth, /api/questions, /api/experiences, etc.)
│
├── client/                   # Vite + React 19 + TypeScript frontend
│   ├── .env                  # Frontend Google Client ID configuration
│   ├── .env.example          # Frontend template env
│   ├── index.html            # Google Identity Services script & typography
│   ├── package.json
│   ├── vite.config.ts        # Configured with /api proxy to http://localhost:5000
│   └── src/
│       ├── components/       # Editorial UI components (Cards, Header, Footer, GoogleSignIn)
│       ├── lib/              # Clean API client, hooks, categories, date formatters, auth context
│       ├── pages/            # Landing, Feed, QuestionDetail, AskQuestion, Contributions (Your Desk)
│       └── main.tsx          # Application root with AuthProvider and BrowserRouter
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Ensure `backend/.env` is configured with your database and credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Neon PostgreSQL Connection URL
DATABASE_URL=postgresql://neondb_owner:[password]@[neon_hostname]/neondb?sslmode=require

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# JWT Secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

Run database migrations and initial seed (automatic on server start, or manually):
```bash
npm run migrate
npm run seed
```

Start the backend API server:
```bash
npm run dev
```
The backend runs at `http://localhost:5000`.

---

### 2. Frontend Setup

In another terminal window:
```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` with automatic API proxying to `http://localhost:5000/api`.

---

## 🔑 Authentication (Google OAuth)

1. The frontend utilizes **Google Identity Services (GSI)** with the configured client ID.
2. Clicking **Sign In** sends Google's secure ID token credential to `POST /api/auth/google`.
3. The backend verifies the ID token using `google-auth-library`, upserts the user in PostgreSQL, and generates a session JWT.
4. Subsequent requests pass `Authorization: Bearer <token>` to access protected features (or personalize contributions in "Your Desk").
5. Authenticated users can choose to contribute questions or experiences with their name or **anonymously**.

---

## 📡 API Reference

### Auth (`/api/auth`)
- `POST /api/auth/google` — Authenticate / register via Google ID token.
- `GET /api/auth/me` — Retrieve currently logged-in user profile.
- `POST /api/auth/logout` — Clear session.

### Questions (`/api/questions`)
- `GET /api/questions` — List questions. Query params:
  - `category` — Filter by slug (`work`, `money`, `relationships`, `health`, `home`, `learning`, or `all`).
  - `q` — Keyword search across question title and body.
  - `sort` — `recent` (default), `answered` (most answers first), or `open` (unanswered questions).
- `GET /api/questions/:id` — Get question details along with all submitted experiences.
- `POST /api/questions` — Ask a question (requires authentication). Body: `{ title, body, category, anonymous }`.
- `DELETE /api/questions/:id` — Delete question (requires author authentication).

### Experiences (`/api/questions/:questionId/experiences` & `/api/experiences`)
- `GET /api/questions/:questionId/experiences` — Retrieve all answers for a question.
- `POST /api/questions/:questionId/experiences` — Submit an experience (requires authentication). Body: `{ body, context, anonymous }`.
- `DELETE /api/experiences/:id` — Remove an experience (requires author authentication).

### Contributions & Metrics
- `GET /api/users/me/contributions` — Fetch questions and experiences submitted by the authenticated user (requires authentication).
- `GET /api/stats` — Total questions, experiences, and distinct contributors.
- `GET /api/health` — Health check endpoint.

---

## 🛠 Database & Migrations

PostgreSQL migrations are located in `backend/migrations/` and tracked in the `schema_migrations` table.

- To apply new migrations: `npm run migrate` (in `backend/`)
- To seed initial mock questions and answers: `npm run seed` (in `backend/`)
- On startup, `server.js` automatically verifies and applies pending migrations and seeds initial data if empty.

---

## 📜 License

ISC
