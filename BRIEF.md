# BRIEF.md

## Project name
BookNook

## Problem it solves
Readers often want one place to track what they have read, remember meaningful quotes, and decide what to read next. BookNook allows users to manage their reading history, store quotes, and receive recommendations based on their preferences.

## Chosen idea — core features
- User registration and login
- Add, view, edit, and delete books in a personal reading tracker
- Rate books and update reading status (want-to-read, reading, finished)
- Save, edit, and delete quotes linked to a specific book
- View book recommendations based on genres or authors from highly rated books

## Data model

### users
- username
- email
- passwordHash
- createdAt

### books
- userId
- title
- author
- genre
- status
- rating
- review
- createdAt
- updatedAt

### quotes
- userId
- bookId
- text
- pageNumber
- note
- createdAt

### recommendedBooks (optional)
- title
- author
- genre
- tags
- description

## API endpoint table

| Method | Path | Purpose |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Log in a user and return a JWT |
| GET | /api/auth/me | Get the currently logged-in user |
| GET | /api/books | Get all books for the current user |
| GET | /api/books/:id | Get one book by ID |
| POST | /api/books | Create a new book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |
| GET | /api/quotes | Get all quotes for the current user |
| GET | /api/books/:bookId/quotes | Get quotes for a specific book |
| POST | /api/books/:bookId/quotes | Add a quote to a book |
| PUT | /api/quotes/:id | Update a quote |
| DELETE | /api/quotes/:id | Delete a quote |
| GET | /api/recommendations | Get recommendations based on user preferences |

## Does the app need authentication?
Yes. Authentication is required because each user should only be able to access and manage their own books, ratings, and saved quotes.
