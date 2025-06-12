// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Book = require("./Book"); // Adjust the path if your file is in a different folder

const app = express();
const PORT = 5000;

// middleware

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// mongoDB Connection

// mongoose.connect("mongodb://127.0.0.1:27017/bookstore",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("✅ MongoDB Connected");
// }).catch((err) => {
//     console.log("MongoDB Connection Error:", err);
// });
mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));


// Routes

// GET /books -> Get all books

app.get("/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// POST /books -> Add a new book

app.post("/books", async (req, res) => {
    const { title, author } = req.body;
    const newBook = new Book({ title, author });
    await newBook.save();
    res.json(newBook);
});

app.put("/books/:id", async(req, res) => {
    try {
        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// DELETE /books/:id -> Delete a book

app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: "Book deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

