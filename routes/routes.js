const express = require('express');

const router = express.Router();

// Simple List of books with ISBN, Author names, titles, actual reviews and comments
const books = [
  {
    isbn: '978-3-16-148410-0',
    author: 'Author Name 1',
    title: 'Book Title 1',
    reviews: [
      {
        reviewer: 'Reviewer 1',
        comment: 'This book was great!',
      },
      {
        reviewer: 'Reviewer 2',
        comment: 'I enjoyed reading this book.',
      },
    ],
  },
  {
    isbn: '978-1-40-289460-1',
    author: 'Author Name 2',
    title: 'Book Title 2',
    reviews: [
      {
        reviewer: 'Reviewer 3',
        comment: 'This book was okay.',
      },
      {
        reviewer: 'Reviewer 4',
        comment: "I didn't like this book.",
      },
    ],
  },
];

// GET /books
// Returns a list of books
router.get('/', (req, res) => {
  res.status(200).send(books);
});

// GET /books/:isbn
router.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.filter((book) => book.isbn === isbn)[0];
  res.json(book);
});

// GET /books/:author
router.get('/books/:author', (req, res) => {
  const author = req.params.author;
  const book = books.filter((book) => book.author === author)[0];
  res.json(book);
});

// GET /books/:title
router.get('/books/:title', (req, res) => {
  const title = req.params.title;
  const book = books.filter((book) => book.title === title)[0];
  res.json(book);
});

// Get book Review
router.get('/books/:title/reviews', (req, res) => {
  const title = req.params.title;
  const book = books.filter((book) => book.title === title)[0];
  res.json(book.reviews);
});

module.exports = router;
