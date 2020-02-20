const express = require("express");
const authorController = require("../controllers/author");
const validator = require("../utils/validator");

const router = express.Router();

router.post("/author", validator.authorController.addAuthor, authorController.addAuthor);
router.put("/author", validator.authorController.updateAuthor, authorController.updateAuthor);
router.get("/author", authorController.getAuthor);
router.get("/test", authorController.testAuthor);
router.delete("/author", validator.authorController.removeAuthor, authorController.removeAuthor);

module.exports = router;