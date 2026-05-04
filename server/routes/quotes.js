const express = require('express');
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.userId })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { text, pageNumber, note } = req.body;
    const quote = await Quote.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { text, pageNumber, note },
      { new: true, runValidators: true }
    );
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
