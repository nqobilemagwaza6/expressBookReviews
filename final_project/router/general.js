const express = require('express');
const axios = require('axios');
let users = require("./auth_users.js").users;
let public_users = express.Router();

// ✅ REGISTER
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

// ✅ GET ALL BOOKS
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching all books" });
    }
});

// ✅ GET BOOK BY ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const book = response.data[isbn];

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// ✅ GET BOOKS BY AUTHOR
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/books');
        const books = Object.values(response.data);
        const filtered = books.filter(book => book.author.toLowerCase() === author);

        if (filtered.length > 0) {
            return res.status(200).json(filtered);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// ✅ GET BOOKS BY TITLE
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/books');
        const books = Object.values(response.data);
        const filtered = books.filter(book => book.title.toLowerCase() === title);

        if (filtered.length > 0) {
            return res.status(200).json(filtered);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// ✅ GET BOOK REVIEWS
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const book = response.data[isbn];

        if (book && book.reviews) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "No reviews found for this book" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reviews" });
    }
});

// ✅ ADD/UPDATE REVIEW
public_users.put('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.body.username || "anonymous"; // Or from auth token/session

    if (!review) {
        return res.status(400).json({ message: "Review content required" });
    }

    try {
        const response = await axios.get('http://localhost:5000/books');
        const book = response.data[isbn];

        if (book) {
            if (!book.reviews) book.reviews = {};
            book.reviews[username] = review;

            return res.status(200).json({
                message: "Review added successfully",
                reviews: book.reviews
            });
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error adding review" });
    }
});

// ✅ DELETE REVIEW
public_users.delete('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get('http://localhost:5000/books');
        const book = response.data[isbn];

        if (book && book.reviews && Object.keys(book.reviews).length > 0) {
            book.reviews = {};
            return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
        } else {
            return res.status(404).json({ message: "No reviews found to delete" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error deleting review" });
    }
});

module.exports.general = public_users;
