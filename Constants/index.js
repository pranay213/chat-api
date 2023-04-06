require("dotenv").config();

const PORT = process.env.PORT;
const DB = process.env.DB;
const SMS_API_URL = process.env.SMSAPI;
const SMS_API_AUTH = process.env.SMS_API_AUTH;
const tokenSecret = process.env.tokenSecret;
const authTokenSecret = process.env.authTokenSecret;

module.exports = {
  SMS_API_URL,
  SMS_API_AUTH,
  PORT,
  DB,
  tokenSecret,
  authTokenSecret,
};
