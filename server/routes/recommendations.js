const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

const CATALOG = [
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', description: 'A legendary figure recounts his extraordinary life in his own words.' },
  { title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'Fantasy', description: 'An epic fantasy set in a world ravaged by highstorms.' },
  { title: 'Mistborn', author: 'Brandon Sanderson', genre: 'Fantasy', description: 'A heist story set in a world where ash falls from the sky.' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'A hobbit is swept into an unexpected quest.' },
  { title: 'A Song of Ice and Fire', author: 'George R.R. Martin', genre: 'Fantasy', description: 'Epic medieval fantasy set across the fictional continents of Westeros.' },
  { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy', description: 'A young boy discovers he is a wizard.' },
  { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', genre: 'Science Fiction', description: 'An ordinary man is swept across the galaxy after Earth is demolished.' },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', description: 'A desert planet becomes the centre of a political and spiritual conflict.' },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', description: 'An astronaut is stranded alone on Mars and must survive.' },
  { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', description: 'A lone astronaut wakes up with no memory and a mission to save Earth.' },
  { title: 'Ender\'s Game', author: 'Orson Scott Card', genre: 'Science Fiction', description: 'A child prodigy is trained in a space battle school to fight an alien war.' },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Science Fiction', description: 'A futuristic society where humans are engineered for social stability.' },
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', description: 'A woman disappears on her anniversary and suspicion falls on her husband.' },
  { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', description: 'A therapist tries to unlock the silence of a patient who shot her husband.' },
  { title: 'Sharp Objects', author: 'Gillian Flynn', genre: 'Thriller', description: 'A journalist returns to her hometown to cover a series of murders.' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Thriller', description: 'A journalist and hacker investigate a decades-old disappearance.' },
  { title: 'Big Little Lies', author: 'Liane Moriarty', genre: 'Mystery', description: 'Three women\'s lives intersect around a murder at a school quiz night.' },
  { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery', description: 'A symbologist investigates a murder at the Louvre that hides a religious secret.' },
  { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Mystery', description: 'A girl raised alone in the marsh becomes a suspect in a local murder.' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic', description: 'A romantic novel about manners and matrimony in Regency England.' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', description: 'A lawyer defends a Black man accused of a crime in the American Deep South.' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', description: 'A mysterious millionaire pursues his lost love in the Jazz Age.' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classic', description: 'A teenager\'s disillusionment with the adult world narrated in his own voice.' },
  { title: 'Normal People', author: 'Sally Rooney', genre: 'Literary Fiction', description: 'Two people navigate love and friendship across years of change.' },
  { title: 'A Little Life', author: 'Hanya Yanagihara', genre: 'Literary Fiction', description: 'Four friends navigate adulthood and the weight of the past in New York City.' },
  { title: 'Educated', author: 'Tara Westover', genre: 'Non-fiction', description: 'A memoir about growing up in a survivalist family and finding education.' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-fiction', description: 'A sweeping history of humankind from the Stone Age to the present.' },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', description: 'A practical guide to building good habits and breaking bad ones.' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Self-help', description: 'A shepherd boy\'s journey across the desert in search of his personal legend.' },
  { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Science Fiction', description: 'In a dystopian future, children are forced to fight to the death on live TV.' }
];

router.get('/', async (req, res) => {
  try {
    const highRated = await Book.find({ userId: req.userId, rating: { $gte: 4 } });
    const userTitles = await Book.find({ userId: req.userId }).distinct('title');

    let recs;
    if (highRated.length > 0) {
      const genres = [...new Set(highRated.map(b => b.genre).filter(Boolean).map(g => g.toLowerCase()))];
      const authors = [...new Set(highRated.map(b => b.author).filter(Boolean).map(a => a.toLowerCase()))];

      recs = CATALOG.filter(book => {
        if (userTitles.includes(book.title)) return false;
        return genres.includes(book.genre.toLowerCase()) || authors.includes(book.author.toLowerCase());
      });

      if (recs.length < 4) {
        const extras = CATALOG.filter(b => !userTitles.includes(b.title) && !recs.includes(b));
        recs = [...recs, ...extras].slice(0, 8);
      } else {
        recs = recs.slice(0, 8);
      }
    } else {
      recs = CATALOG.filter(b => !userTitles.includes(b.title)).slice(0, 8);
    }

    res.json(recs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
