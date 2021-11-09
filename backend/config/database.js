const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;
const connectdb = () => {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("DB connected");
    })
};


module.exports = connectdb; 
