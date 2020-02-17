const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Transaction = require("mongoose-transactions");
const Book = require("../models/book");
const Author = require("../models/author");
const validator = require("../utils/validator");

const useDB = true;
const transaction = new Transaction(useDB);

exports.getBook = (req, res, next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check book search fields again.",
      422
    );
  }  
  const bookSearch = req.params.search.trim();
if(!bookSearch){
  const currentPage = req.query.page || 1;
  const perPage = 20;
  Book.getBooksPagination(currentPage, perPage).then(result => {
    if(result.totalBooks > 0){
      res.status(200).json({
        message: "find books successfuly.",
        books: result.books,
        totalBooks: result.totalBooks
      });
    }
    else{
      validator.errorHandle("Could not find book.", 404);
    }
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}
else{
 Book.getBooks(bookSearch)
 .then(result=>{
  if(result.books){
    res.status(200).json({
      message: "find book successfuly.",
      books: result.books    
    });
  }
  else{
    validator.errorHandle("Could not find book.", 404); 
  }
 })
 .catch(err=>{
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 });
}
};

exports.addBook = (req, res, next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check book fields again.",
      422
    );
  }
  const newBook = new Book({
    title: req.body.title,
    isbn: req.body.isbn,
    total_pages: req.body.total_pages,
    author: req.body.authorId
  });
  newBook
    .save()
    .then(result => {
      res.status(201).json({
        message: "Create new book successful",
        bookId: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateBook = (req, res, next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check book fields again.",
      422
    );
  }
  const title = req.body.title;
  const isbn = req.body.isbn;
  const authorId = req.body.authorId;
  const total_pages = req.body.total_pages;
  const bookId = req.body.bookId;
  Book.findById(bookId)
    .then(book => {
      if (!book) {
        validator.errorHandle("Could not find book.", 404);
      }
      book.title = title;
      book.isbn = isbn;
      book.authorId = authorId;
      book.total_pages = total_pages;
      book.save();
    })
    .then(result => {      
      res.status(200).json({
        message: "Update book successful"        
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.removeBook = (req, res, next)=>{
  const errors = validationResult(req);
  const bookId = req.body.bookId;
  Book.findById(bookId)
    .then(async book => {
      if (!book) {
        validator.errorHandle("Could not find book.", 404);
      }
      transaction.remove('Book', bookId);
      const operations = transaction.getOperations();
    //  console.log(operations);
      const transId = await transaction.saveOperations();
    //  console.log(transId);
      const newTransaction = new Transaction(true);
      await newTransaction.loadDbTransaction(transId);
      try {
        const final = await newTransaction.run();
        transaction.clean();
        return res.status(200).json({
          message: "Delete book successful."
        });
      } catch (error) {
        const rolled = await newTransaction.rollback();
        transaction.clean();
        validator.errorHandle("Could not delete this book.", 500);
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
