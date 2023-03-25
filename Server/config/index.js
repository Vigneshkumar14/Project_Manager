import * as dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGODBURL: process.env.MONGODBURL,
  SALTROUNDS: process.env.SALTROUNDS,
  SECRET: process.env.SECRET,
  EXPIRY: process.env.EXPIRY,
};

export default config;
