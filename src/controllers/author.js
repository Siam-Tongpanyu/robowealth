const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Transaction = require("mongoose-transactions");
const Author = require("../models/author");
const validator = require("../utils/validator");
const { port, mongo } = require("../config/vars.js");

const useDB = true;
const transaction = new Transaction(useDB);

exports.addAuthor = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check title or content.",
      422
    );
  }
  const author = new Author({
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });
  author
    .save()
    .then(result => {
      res.status(201).json({
        message: "Create new author successful",
        userId: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateAuthor = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check title or content.",
      422
    );
  }
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const authorId = req.body.authorId;
  Author.findById(authorId)
    .then(author => {
      if (!author) {
        validator.errorHandle("Could not find author.", 404);
      }
      author.firstname = firstname;
      author.lastname = lastname;
      author.save();
    })
    .then(result => {
      res.status(200).json({
        message: "Update author successful"        
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAuthor = (req, res, next)=>{
  const currentPage = req.query.page || 1;
  const perPage = 20;
  Author.getAuthorsPagination(currentPage, perPage).then(result => {
    if(result.totalAuthors > 0){
      res.status(200).json({
        message: "find authors successfuly.",
        authors: result.authors,
        totalAuthors: result.totalAuthors
      });
    }  
    else{
      validator.errorHandle("Could not find author.", 404);
    }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.removeAuthor = (req, res, next)=>{
  const errors = validationResult(req);
  const authorId = req.body.authorId;
  Author.findById(authorId)
    .then(async author => {
      if (!author) {
        validator.errorHandle("Could not find author.", 404);
      }
      transaction.remove('Author', authorId);
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
          message: "Delete author successful."
        });
      } catch (error) {
        const rolled = await newTransaction.rollback();
        transaction.clean();
        validator.errorHandle("Could not delete this author.", 500);
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.testAuthor = (req, res, next)=>{
  mongoose.connect(mongo.uri, mongo.option)
  .then(result=>{
    res.status(200).json({
      message: "test connect db successfuly." +  mongo.uri  
    });
  })
  .catch(err=>{
    res.status(200).json({
      message: "test authors successfuly.",
      errdata: err   
    });
  })  
};
