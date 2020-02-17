const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }  
}, {
  timestamps: true
});

AuthorSchema.static('getAuthorsPagination', async function (currentPage, perPage) {
  const count = await this.find().countDocuments();
  const authors = await this.find().skip((currentPage - 1) * perPage).limit(perPage).sort({
    createdAt: -1
  });
  return {
    authors: authors,
    totalAuthors: count
  };
});

module.exports = mongoose.model("Author", AuthorSchema);
