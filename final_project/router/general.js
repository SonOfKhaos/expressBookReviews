const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => resolve(JSON.stringify(books)), 500);
    });
    
    promise1.then((result) => {
        return res.status(200).json({message: "List retrieved succesfully", books: result});
    })
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[isbn]), 500);
  });

  const book = await promise2;
  if(book){
    return res.status(200)
    .json({message: "Book with ISBN " + isbn + " successfully retrieved", book});
   } else {
    return res.status(404).json({ message: "Book Not Found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (b) => b.author === authorName
  );
  res.send(JSON.stringify(filteredBooks));
  return res.status(200).json({message: "Book with Author " + author + " successfully retrieved"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const titleName = req.params.title;
  const promise3 = new Promise((resolve, reject) => {
    setInterval(() => {
        const filteredTitle = Object.values(books).filter(
            (t) => t.title === titleName
          );
        return resolve(filteredTitle);
    }, 500);
  });

  const filteredTitle = await promise3;

  if(filteredTitle.length > 0) {
    return res.status(200).json({ books: filteredTitle});
  } else {
    return res.status(404).json({message :"Book not Found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;
