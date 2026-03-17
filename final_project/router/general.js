const express = require('express');
const axios = require('axios');
let users = require("./auth_users.js").users;

let public_users = express.Router();

// Register
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


// ✅ Get all books USING AXIOS
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


// ✅ Get by ISBN USING AXIOS
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get('http://localhost:5000/books');
        const book = response.data[isbn];

        if (book) {
            return res.json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching ISBN" });
    }
});


// ✅ Get by AUTHOR USING AXIOS
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    try {
        const response = await axios.get('http://localhost:5000/books');
        const books = Object.values(response.data);

        const result = books.filter(
            book => book.author.toLowerCase() === author
        );

        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(404).json({ message: "No books found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching author" });
    }
});


// ✅ Get by TITLE USING AXIOS
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    try {
        const response = await axios.get('http://localhost:5000/books');
        const books = Object.values(response.data);

        const result = books.filter(
            book => book.title.toLowerCase() === title
        );

        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(404).json({ message: "No books found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching title" });
    }
});


// Get reviews (this one is fine)
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    const books = require("../booksdb.js");

    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    }

    return res.status(404).json({ message: "No reviews found" });
});

module.exports.general = public_users;
