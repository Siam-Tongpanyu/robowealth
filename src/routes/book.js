const express = require("express");
const bookController = require("../controllers/book");
const validator = require("../utils/validator");

const router = express.Router();

// GET /fees/posts
router.get("/book/:search?", validator.bookController.getBook, bookController.getBook);
router.post("/book", validator.bookController.addBook, bookController.addBook);
router.put("/book", validator.bookController.updateBook, bookController.updateBook);
router.delete("/book", validator.bookController.removeBook, bookController.removeBook);

module.exports = router;