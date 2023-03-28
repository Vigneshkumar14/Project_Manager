import transpoter from "../config/transpoter.config.js";
import handlebars from "handlebars";
import fs from "fs";
import * as path from "path";
import config from "../config/index.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "./customError.js";

// Parameters required (toEmail, subject,text,username,otp)

const sendEmails = async (options) => {
  try {
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "./utils/mailTemplate.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      user: options.username,
      otp: options.otp,
    };
    const htmlToSend = template(replacements);

    const message = {
      from: config.SMTP_MAIL_EMAIL, // sender address
      to: options.toEmail, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: htmlToSend,
    };
    const mailSuccess = await transpoter.sendMail(message);
    if (mailSuccess) return { success: true };
  } catch (err) {
    throw new CustomError("OTP is not sent", 500);
  }
};

export default sendEmails;
