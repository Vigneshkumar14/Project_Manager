import mongoose from "mongoose";
import config from "../config/index.js";

export const connectToDB = () => {
  mongoose
    .connect(config.MONGODBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB is connected"))
    .catch((error) => {
      console.log("DB connect error - ", error);
      process.exit(1);
    });
};

// export { connectToDB };
