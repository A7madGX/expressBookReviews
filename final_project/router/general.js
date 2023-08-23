const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(403).json({message: 'Incomplete data. Try again.'})
  } 
  if (isValid(username)) {
    return res.status(403).json({message: `User ${username} already exists.`})
  }
  users.push({
    username,
    password
  })
  return res.status(200).json({message: 'User registered successfully.'})
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  // const booktitles =[];

  // for (const isbn of Object.keys(books)) {
  //   booktitles.push(books[isbn]['title'])
  // }
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    if (!isbn) {
      return res.status(403).json({message: 'Provide an ISBN.'})
    }
    if (books[isbn]) {
      return res.status(200).json(books[isbn])
    } 
    return res.status(403).json({message: 'Book not found'})
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  if (!author) {
    return res.status(403).json({message: 'Provide author name.'})
  }
  const bookByAuthor = []
  for(const isbn of Object.keys(books)) {
    if (books[isbn]['author'] == author) {
      bookByAuthor.push(books[isbn])
    }
  }
  if (bookByAuthor.length > 0) {
    return res.status(200).send(bookByAuthor)
  }
  return res.status(403).json({message: 'No book found by this author'})
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title
  if (!title) {
    return res.status(403).json({message: 'Provide title of the book.'})
  }
  const bookBytitle = []
  for(const isbn of Object.keys(books)) {
    if (books[isbn]['title'] == title) {
      bookBytitle.push(books[isbn])
    }
  }
  if (bookBytitle.length > 0) {
    return res.status(200).send(bookBytitle)
  }
  return res.status(403).json({message: 'No book found by this title'})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (!isbn) {
    return res.status(403).json({message: 'Provide isbn of the book.'})
  }
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn]['review']))
  }
  return res.status(403).json({message: 'Book not found.'})
});

module.exports.general = public_users;
