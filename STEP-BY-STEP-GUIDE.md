# STEP-BY-STEP-GUIDE.md

A personal guide for setting up BookNook from scratch on a new machine. Written while building the project.

---

## Back-End Setup

### Prerequisites
- Node.js v18 or higher
- npm (comes with Node)
- A MongoDB Atlas account (free tier is fine)
- Thunder Client extension in VS Code (for testing routes)

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/<your-username>/CapstoneProject.git
cd CapstoneProject/server
npm install
```

### 2. Configure the .env file

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

| Variable | What it is |
|---|---|
| `PORT` | Port the server listens on. `5000` works fine locally. |
| `MONGO_URI` | Your MongoDB Atlas connection string. Get it from Atlas → Connect → Drivers. |
| `JWT_SECRET` | Any long random string. Used to sign and verify JWTs. Never share it. |
| `CLIENT_URL` | The origin of your front-end. `http://localhost:5173` for local dev. |

Never commit the real `.env` file — it is in `.gitignore`.

### 3. Configure Claude Code (CLAUDE.md)

The project includes a `CLAUDE.md` file in the root. Claude Code reads this automatically when you open the project, giving it context about the tech stack and conventions. No extra setup needed.

### 4. Connect to MongoDB Atlas

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster if you don't have one
3. Under **Database Access**, add a user with read/write access
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) or your current IP
5. Click **Connect → Drivers** and copy the connection string into `MONGO_URI` in your `.env`
6. Replace `<password>` in the URI with your database user's actual password

### 5. Start the server

```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

If you see a MongoDB connection error, double-check your `MONGO_URI` and that your IP is allowed in Atlas Network Access.

### 6. Test routes in Thunder Client

Install the Thunder Client VS Code extension, then test each route:

**Register a user**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON): `{ "username": "testuser", "email": "test@test.com", "password": "password123" }`
- Expected: `201` with a token

**Log in**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON): `{ "email": "test@test.com", "password": "password123" }`
- Expected: `200` with a token

**Get current user (protected)**
- Method: `GET`
- URL: `http://localhost:5000/api/auth/me`
- Header: `Authorization: Bearer <token from login>`
- Expected: `200` with user object

**Create a book (protected)**
- Method: `POST`
- URL: `http://localhost:5000/api/books`
- Header: `Authorization: Bearer <token>`
- Body: `{ "title": "Dune", "author": "Frank Herbert", "genre": "Science Fiction", "status": "finished", "rating": 5 }`

**Get all books (protected)**
- Method: `GET`
- URL: `http://localhost:5000/api/books`
- Header: `Authorization: Bearer <token>`

All book, quote, and recommendation routes require the `Authorization` header with a valid JWT.

---

## Front-End Setup

### 1. Install dependencies

```bash
cd ../client
npm install
```

### 2. Set the API URL environment variable

For local development, the Vite dev server proxies `/api` requests to `http://localhost:5000`, so no `.env` file is needed locally. The proxy is configured in `vite.config.js`.

For production, create a `.env.production` file:

```
VITE_API_URL=https://your-app.up.railway.app/api
```

Replace the URL with your actual Railway deployment URL (set this up during deployment).

### 3. Run the dev server

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`. Open it in a browser.

### 4. Verify the front-end connects to the back-end

1. Make sure the back-end server is running (`npm run dev` in `server/`)
2. Open the app, click **Get Started**, register a new account
3. You should be redirected to the dashboard
4. Try adding a book — if it appears in the list, the connection is working

---

## Deployment

### Back-end — Railway

1. Push your code to GitHub if you haven't already
2. Go to [railway.app](https://railway.app) and sign in with GitHub
3. Click **New Project → Deploy from GitHub repo**
4. Select your `CapstoneProject` repository
5. Railway will detect the `server/` folder — set the **Root Directory** to `server`
6. Under **Variables**, add the following environment variables:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Your JWT secret |
| `CLIENT_URL` | Your GitHub Pages URL (e.g. `https://<username>.github.io/CapstoneProject`) |
| `PORT` | Leave blank — Railway sets this automatically |

7. Railway will run `npm start` (which runs `node server.js`)
8. Once deployed, copy the Railway-provided URL (e.g. `https://booknook-api.up.railway.app`)

### Front-end — GitHub Pages

1. In `client/`, create a `.env.production` file (not committed — add to `.gitignore`):

```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

2. Build and deploy:

```bash
cd client
npm run deploy
```

This runs `vite build` (with base `/CapstoneProject/`) then pushes the `dist/` folder to a `gh-pages` branch using the `gh-pages` package.

3. In your GitHub repo, go to **Settings → Pages** and set the source to the `gh-pages` branch, root `/`.

4. Your app will be live at `https://<username>.github.io/CapstoneProject/`

### CORS note

The back-end only accepts requests from the origin set in `CLIENT_URL`. Make sure the Railway environment variable matches your exact GitHub Pages URL including the protocol (`https://`).

### Linking the two

Once both are deployed:
- The front-end calls `VITE_API_URL` (your Railway URL)
- The back-end allows CORS from `CLIENT_URL` (your GitHub Pages URL)
- MongoDB Atlas allows connections from Railway's IP (use `0.0.0.0/0` to allow all, or add Railway's static IP if on a paid plan)
