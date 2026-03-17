const express = require('express');
let books = require("../booksdb.js");
let users = require("./auth_users.js").users;
let public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn], null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const results = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (results.length > 0) {
        return res.send(JSON.stringify(results, null, 4));
    }
    return res.status(404).json({ message: "No books found by this author" });
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const results = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (results.length > 0) {
        return res.send(JSON.stringify(results, null, 4));
    }
    return res.status(404).json({ message: "No books found with this title" });
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "No reviews found for this book" });
});

module.exports.general = public_users;
