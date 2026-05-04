# REFLECTION.md

## Q1 — Scope decisions

Comparing my original BRIEF.md feature list to what I actually built, the core features remained largely the same. I kept:

- User registration and login with JWT
- Full CRUD for books (add, view, edit, delete)
- Reading status (want-to-read, reading, finished) and star ratings
- Quotes linked to specific books (add, edit, delete)
- Recommendations based on highly-rated books

The one area I simplified was recommendations. The BRIEF mentioned "recommendations based on genres or authors from highly rated books," and I implemented this using a static catalogue of well-known books filtered by the user's preferred genres and authors. I decided against integrating an external books API because that would have added scope (API keys, rate limits, error handling) for a feature that is already functional without it. A static list is honest about what it is and still delivers a meaningful result.

I also did not add a dedicated "Quotes" page (separate from Book Detail), even though it was sketched in the wireframes. I felt that quotes are most useful in context, i.e., alongside the book they belong to, so keeping them inside Book Detail was the right call for usability rather than adding another route that would just show a flat list.

---

## Q2 — Technical challenge

The single hardest problem was getting CORS to work correctly between the deployed front-end on GitHub Pages and the back-end on Railway.

During local development, the Vite proxy handled routing from `localhost:5173/api` to `localhost:5000/api`, so CORS was never an issue. When I deployed, requests from the GitHub Pages URL were blocked by the browser because the Railway server was returning a CORS error.

The root cause was that `CLIENT_URL` in the Railway environment variables was set to the GitHub Pages URL without a trailing slash, but at one point I had tested with a slightly different URL format. Once I confirmed the exact origin string in the browser's network tab and matched it exactly in the Railway `CLIENT_URL` variable, the error resolved.

The lesson: always test the deployed front-end against the deployed back-end early. Do not assume local proxy behaviour carries over to production.

---

## Q3 — AI and vibe-coding

**Example where AI output worked well with minimal changes:**

I asked Claude Code to generate the full Express route file for books, describing the data model and the endpoints I needed. The output was essentially production-ready — correct Mongoose queries, proper error handling with try/catch on every route, and the correct HTTP status codes (201 for creation, 404 for missing resources, 400 for validation failures). I used it almost verbatim. This worked because the task was well-defined: I gave it a clear schema, a list of routes, and explained that all routes must be protected by the auth middleware.

**Example where I had to significantly debug or rewrite:**

I asked Claude Code to help me set up the Vue Router with navigation guards. The first version it produced used `createWebHistory` and assumed a server that could handle HTML5 routing. When I deployed to GitHub Pages, navigating directly to any route other than `/` returned a 404. I had to understand why hash history exists, rewrite the router to use `createWebHashHistory`, and update all internal links to work with hash-based URLs. The AI gave me correct code for a Node server context, but I had to understand the deployment environment to know which piece needed changing.

What I learned: AI is fastest when the environment and constraints are fully specified. Leaving deployment target implicit led to a correct-looking but wrong answer.

---

## Q4 — Architecture

Here is how data flows when a logged-in user clicks **Add Book** and submits the form:

1. **User action:** The user fills in the form in `AddBookView.vue` and clicks the submit button.
2. **Vue component:** The `submit()` method is called. It calls `useBooksStore().createBook(form)`.
3. **Pinia store:** `createBook` in `books.js` calls `api.post('/books', bookData)` using the axios instance from `api/index.js`.
4. **Axios interceptor:** Before the request goes out, the request interceptor reads the JWT from `localStorage` and attaches it as `Authorization: Bearer <token>` in the headers.
5. **Express back-end:** The request arrives at `POST /api/books`. The `auth` middleware runs first — it reads the `Authorization` header, verifies the JWT with `jwt.verify`, and if valid, sets `req.userId` from the token payload and calls `next()`.
6. **Route handler:** The books route handler creates a new Mongoose `Book` document with `userId: req.userId` plus the submitted fields. It calls `book.save()`, which writes the document to MongoDB Atlas.
7. **MongoDB Atlas:** The document is persisted in the `books` collection.
8. **Response:** Express sends back `201` with the saved book document as JSON.
9. **Pinia store:** The store receives the response, calls `this.books.unshift(data)` to prepend the new book to the local list, and returns the new book object.
10. **Vue component:** On success, the component calls `this.$router.push('/books/${book._id}')`, navigating the user to the new book's detail page. The data is now visible in the UI and persisted in the database.

---

## Q5 — If you had two more weeks

The first thing I would add is a proper search bar on the dashboard. Right now users can filter by status and genre, but they cannot search by title or author name. This would be a `GET /api/books?q=keyword` endpoint that does a case-insensitive regex match on title and author in Mongoose, with a debounced input on the front-end.

Second, I would improve the recommendations feature. The current implementation uses a hardcoded catalogue of 30 books. With more time, I would integrate the Open Library API, which is free and does not require an API key. This would allow recommendations from a catalogue of millions of books rather than a fixed list, and would let users click through to see cover images and fuller descriptions.

Technically the approach would be: on the back-end, call the Open Library search endpoint with the user's preferred genres as query terms, cache the results briefly so repeat requests do not hammer the API, and return formatted results to the front-end. This fits naturally into the existing `/api/recommendations` route with a minor refactor.
