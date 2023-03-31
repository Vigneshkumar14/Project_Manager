import * as dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGODBURL: process.env.MONGODBURL,
  SALTROUNDS: process.env.SALTROUNDS,
  SECRET: process.env.SECRET,
  EXPIRY: process.env.EXPIRY,
  // Email config variables
  SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
  SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
  SMTP_MAIL_SECURE: process.env.SMTP_MAIL_SECURE,
  SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
  SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
  SMTP_MAIL_EMAIL: process.env.SMTP_MAIL_EMAIL,

  // Cloudinary variables

  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  CLOUDINARY_FOLDER_NAME: process.env.CLOUDINARY_FOLDER_NAME,
};

export default config;
