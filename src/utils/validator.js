const {
  query,
  body,
  param,
  validationResult
} = require("express-validator");
const Author = require("../models/author");
const Book = require("../models/book");
const mongoose = require("mongoose");

const errorHandle = (message, statusCode, errResult) => {
  errResult = errResult || 0;
  message = message || "default error message from errorHandle";
  error = new Error(message);
  error.statusCode = statusCode || 500;
  if (errResult) {
    error.data = errResult.array();
  }
  throw error;
};

const checkMongoId = (mongoId) => {
  if (mongoose.Types.ObjectId.isValid(mongoId)) {
    return true;
  } else {
    error = new Error("invalid MongoDB ID");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  errorHandle: errorHandle,
  checkMongoId: checkMongoId,
  bookController: {
    addBook: [
      body("title")
        .trim()
        .isLength({
          min: 3,
          max: 40
        })
        .withMessage(
          "Please input book name more than 2 char and less than 40 char."
        ),
      body("total_pages")
        .trim()
        .isInt()
        .withMessage("Please use Integer for total pages")
        .isLength({
          min: 1,
          max: 5
        }),
      body("isbn")
        .trim()
        .isLength({
          min: 10,
          max: 25
        }),
      body("authorId")
        .trim()
        .isMongoId()
        .withMessage("Please use correct ID")
        .isLength({
          max: 30
        })
        .custom((value, { req }) => {
          return Author.findOne({
            _id: value
          }).then(userDoc => {
            if (!userDoc) {
              return Promise.reject("This author ID not exits.");
            }
          });
        })
    ],
    getBook: [
      param("search")
        .trim()
        .isLength({          
          max: 40
        })
        .withMessage("Please input less than 40 chars for search book.")      
    ],
    updateBook: [
      body("title")
        .trim()
        .isLength({
          min: 3,
          max: 40
        })
        .withMessage(
          "Please input book name more than 2 char and less than 40 char."
        ),
      body("total_pages")
        .trim()
        .isInt()
        .withMessage("Please use Integer for total pages")
        .isLength({
          min: 1,
          max: 5
        }),
      body("isbn")
        .trim()
        .isLength({
          min: 10,
          max: 25
        }),
      body("authorId")
        .trim()
        .isMongoId()
        .withMessage("Please use author correct ID")
        .isLength({
          max: 30
        })
        .custom((value, { req }) => {
          return Author.findOne({
            _id: value
          }).then(userDoc => {
            if (!userDoc) {
              return Promise.reject("This author ID not exits.");
            }
          });
        }),
      body("bookId")
        .trim()
        .isMongoId()
        .withMessage("Please use book correct ID")
        .isLength({
          max: 30
        })
        .custom((value, { req }) => {
          return Book.findOne({
            _id: value
          }).then(bookDoc => {
            if (!bookDoc) {
              return Promise.reject("This book ID not exits.");
            }
          });
        })
    ],
    removeBook: [
      body("bookId")
        .trim()
        .isMongoId()
        .withMessage("Please use book correct ID")
        .isLength({
          min: 5,
          max: 30
        })
    ]
  },
  authorController: {
    addAuthor: [
      body("firstname")
        .trim()
        .isLength({
          min: 3,
          max: 15
        })
        .withMessage(
          "Please input book name more than 2 char and less than 15 char."
        ),
      body("lastname")
        .trim()
        .isLength({
          min: 3,
          max: 15
        })
        .withMessage(
          "Please input book name more than 2 char and less than 15 char."
        )
    ],
    removeAuthor: [
      body("authorId")
        .trim()
        .isMongoId()
        .withMessage("Please use author correct ID")
        .isLength({
          max: 30
        })
    ],
    updateAuthor: [
      body("authorId")
        .trim()
        .isMongoId()
        .withMessage("Please use author correct ID")
        .isLength({
          max: 30
        }),
      body("firstname")
        .trim()
        .isLength({
          min: 3,
          max: 15
        })
        .withMessage(
          "Please input book name more than 2 char and less than 15 char."
        ),
      body("lastname")
        .trim()
        .isLength({
          min: 3,
          max: 15
        })
        .withMessage(
          "Please input book name more than 2 char and less than 15 char."
        )
    ]
  }
};