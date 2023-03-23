require("dotenv").config();

const config = {
  PORT: process.env.PORT,
  MONGODBURL: process.env.MONGODBURL,
  SALTROUNDS: process.env.SALTROUNDS,
};

export default config;
