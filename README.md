# BookNook

A personal reading tracker built with Vue 3, Express, and MongoDB.

## Live URLs

- **Front-end:** https://charpf3.github.io/CapstoneProject/
- **Back-end API:** https://capstoneproject-production-ead1.up.railway.app

## What it does

- Add, view, edit, and delete books in your personal reading list
- Track reading status (want to read, reading, finished) and rate books 1–5 stars
- Save quotes from books with optional page number and personal note
- Get book recommendations based on your highest-rated genres

## Tech stack

| Layer | Technology |
|---|---|
| Front-end | Vue 3, Vite, Pinia, Vue Router 4 |
| Back-end | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT |
| Deployment | GitHub Pages (front-end), Railway (back-end) |

## Local setup

### Requirements
- Node.js 18+
- A MongoDB Atlas account

### Back-end

```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, CLIENT_URL
npm run dev
```

### Front-end

```bash
cd client
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Environment variables

**server/.env**

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLIENT_URL` | Front-end origin for CORS (e.g. `http://localhost:5173`) |

**client/.env.production** (created during deployment, not committed)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL to deployed back-end API |

See `STEP-BY-STEP-GUIDE.md` for full deployment instructions.
