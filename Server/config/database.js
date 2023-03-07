const mongoose = require("mongoose");
const MONGODBURL = process.env.MONGODBURL;

exports.connectToDB = () => {
  mongoose
    .connect(MONGODBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB is connected"))
    .catch((error) => {
      console.log("DB connect error - ", error);
      process.exit(1);
    });
};
