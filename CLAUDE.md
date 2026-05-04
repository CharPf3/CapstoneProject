# BookNook — Claude Code Configuration

## Project overview
BookNook is a full-stack personal reading tracker. Users can add books, set reading status, give star ratings, save quotes, and receive recommendations.

## Tech stack
- **Back-end:** Node.js + Express, MongoDB Atlas + Mongoose, JWT auth — lives in `server/`
- **Front-end:** Vue 3 (Options API), Vite, Pinia, Vue Router 4 — lives in `client/`

## Key conventions
- Vue components use Options API only (not Composition API)
- All API routes are prefixed `/api/`
- JWT is stored in localStorage and sent as `Authorization: Bearer <token>`
- Hash history router (no server rewrite needed for GitHub Pages)

## Running locally
```bash
# Terminal 1 — back-end
cd server && npm install && npm run dev

# Terminal 2 — front-end
cd client && npm install && npm run dev
```

## Environment files
- `server/.env` — copy from `server/.env.example`, fill in MONGO_URI and JWT_SECRET
- `client/.env` — optional; defaults to proxy `/api` → `localhost:5000`
