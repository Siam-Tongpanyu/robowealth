const mongoose = require("mongoose");
const Author = require('./author');
const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  total_pages: {
    type: Number,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true
  }  
}, {
  timestamps: true
});

BookSchema.static('getBooksPagination', async function (currentPage, perPage) {
  const count = await this.find().countDocuments();
  const books = await this.find().skip((currentPage - 1) * perPage).limit(perPage).sort({
    createdAt: -1
  });
  return {
    books: books,
    totalBooks: count
  };
});

BookSchema.static("getBooks", async function(searchText) {
  try {
    const books = await this.find().or([
      { title: new RegExp(".*" + searchText + ".*") },
      { isbn: searchText }
    ]);
    console.log(books);
    if (books.length > 0) {      
      return {
        books: books
      };
    } else {      
      const authors_id = await Author.find()
        .or([{ firstname: searchText }, { lastname: searchText }])
        .select("_id");
      console.log(authors_id);
      if (authors_id.length > 0) {
        const books2 = await this.find({ author: { $in: authors_id } });
        return {
          books: books2
        };
      } else {
        return {
          books: []
        };
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("Book", BookSchema);