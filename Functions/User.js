const jwt = require("jsonwebtoken");
const {
  SMS_API_URL,
  SMS_API_AUTH,
  PORT,
  DB,
  tokenSecret,
} = require("../Constants");
const axios = require("axios");
const { wallet_balance, send_sms } = require("../fast-two-sms");

const OTP_TOKEN = async (number) => {
  let otp = await generateOTP();

  //otp enabler here
  //   await sendOtp(number, otp);
  let token = await jwt.sign(
    {
      otp: otp,
    },
    tokenSecret,
    { expiresIn: 30 }
  );
  //   console.log(token);
  return token;
};

const generateOTP = async () => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += await digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const sendOtp = async (number, otp) => {
  let balance = await wallet_balance();
  if (balance.return) {
    if (balance.wallet >= 0.2) {
      let res = await send_sms(number, otp);
      //   console.log("---Send Response", res);
      return res;
    } else {
      console.log("Dont have suffient Balnce");
    }
  } else {
    console.log("UnAuthorized");
  }
};

const TokenVerify = async (token) => {};

const TokenExpiry = async (token) => {
  try {
    var decoded = await jwt.verify(token, tokenSecret);
    // console.log("Token Response", decoded); // bar
    return decoded;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

module.exports = { OTP_TOKEN, sendOtp, TokenVerify, TokenExpiry };
