const express = require('express');
const Book = require('../models/Book');
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const filter = { userId: req.userId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.genre) filter.genre = new RegExp(req.query.genre, 'i');
    const books = await Book.find(filter).sort({ updatedAt: -1 });
    res.json(books);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.userId });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, genre, status, rating, review } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    const book = new Book({ userId: req.userId, title, author, genre, status, rating, review });
    await book.save();
    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, author, genre, status, rating, review } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, author, genre, status, rating, review, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await Quote.deleteMany({ bookId: req.params.id });
    res.json({ message: 'Book deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:bookId/quotes', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.bookId, userId: req.userId });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const quotes = await Quote.find({ bookId: req.params.bookId, userId: req.userId }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:bookId/quotes', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.bookId, userId: req.userId });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const { text, pageNumber, note } = req.body;
    if (!text) return res.status(400).json({ message: 'Quote text is required' });
    const quote = new Quote({ userId: req.userId, bookId: req.params.bookId, text, pageNumber, note });
    await quote.save();
    res.status(201).json(quote);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
