const jwt = require("jsonwebtoken");
const {
  SMS_API_URL,
  SMS_API_AUTH,
  PORT,
  DB,
  tokenSecret,
  authTokenSecret,
} = require("../Constants");
const axios = require("axios");
const { wallet_balance, send_sms } = require("../fast-two-sms");

const OTP_TOKEN = async (number) => {
  let otp = await generateOTP();

  //otp enabler here
  //   await sendOtp(number, otp);
  let token = await jwt.sign(
    {
      number,
      otp: otp,
    },
    tokenSecret,
    { expiresIn: 60 }
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

const sendOtp = async (token) => {
  let balance = await wallet_balance();
  if (balance.return) {
    if (balance.wallet >= 0.2) {
      let response = await TokenDecode(token);
      console.log("Token Decode ", response);
      if (response) {
        const { number, otp } = response;
        let res = await send_sms(number, otp);
        if (res.return) {
          return true;
        }
      }
      //   console.log("---Send Response", res);
      // return res;
    } else {
      console.log("Dont have suffient Balnce");
    }
  } else {
    console.log("UnAuthorized");
  }
};

const TokenVerify = async (token, number, otp, id) => {
  try {
    var decoded = await jwt.verify(token, tokenSecret);
    // console.log("Token Response", decoded); // bar
    if (decoded) {
      console.log("Decoded-----", decoded);
      if (
        number === parseInt(decoded.number) &&
        otp === parseInt(decoded.otp)
      ) {
        let res = await authTokenGen(id);
        return { status: true, message: "You are authenticated", token: res };
      } else {
        return { status: false, message: "You are not authenticated" };
      }
    }
    return decoded;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

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

const TokenDecode = async (token) => {
  try {
    var decoded = await jwt.verify(token, tokenSecret);
    // console.log("Token Response", decoded); // bar
    return decoded;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

const authTokenGen = async (id) => {
  let token = await jwt.sign(
    {
      id,
    },
    authTokenSecret,
    { expiresIn: 60 }
  );
  return token;
};

module.exports = {
  OTP_TOKEN,
  sendOtp,
  TokenVerify,
  TokenExpiry,
  TokenDecode,
  authTokenGen,
};
