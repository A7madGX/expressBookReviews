const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const user = users.filter((user) => user.username == username)
  if (user.length > 0) {
    return true
  }
  return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.filter((user) => {
    return (user.username == username && user.password == password)
  });
  if (user.length > 0) {
    return true
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accesstoken = jwt.sign({
      payload: {
        username,
        password
      }
    }, 'secretKey', {expiresIn: 60*60});
    req.session.authorization = {
      accesstoken
    }
    return res.status(200).json({message: 'User logged in successfully.'})
  } else {
    return res.status(403).json({message: 'Username or Password is incorrect.'})
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user['payload']['username']
  const review = req.query.review

  if (!isbn && !books[isbn]) {
    return res.status(403).json({message: 'Provide an existing ISBN.'})
  }

  books[isbn]['reviews'][username] = review
  return res.status(200).json({message: `Review is saved successfully for User: ${username}`})
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user['payload']['username']

  if (!isbn && !books[isbn]) {
    return res.status(403).json({message: 'Provide an existing ISBN.'})
  }

  delete books[isbn]['reviews'][username]
  return res.status(200).json({message: `Review is deleted successfully for User: ${username}`})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
