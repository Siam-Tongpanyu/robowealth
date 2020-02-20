const path = require("path");

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  mongo: {
    /*  uri:
      process.env.MONGO_URI ||
      "mongodb+srv://siam_tongpanyu02:Olbanus835@cluster0siam-r5ldc.mongodb.net/robowealth_test?retryWrites=true&w=majority", */
    uri: process.env.MONGO_URI || "mongodb://root:example@mongo:27017/admin",
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,    
      dbName: 'robowealth'
    }
  }
};
