const express = require("express");
const { OTP_TOKEN, sendOtp } = require("../Functions/User");
const UserModel = require("../Models/UserSchema");
const { UserSave } = require("../Models/UserSchema");

const UserRoute = express.Router();

UserRoute.get("/", (req, res) =>
  res.json({ Status: "This is UserRouter" })
).post("/", async (req, res) => {
  const { number } = req.body;
  const regex = /^[6-9]\d{9}$/;
  if (regex.test(number)) {
    //   let otp_token = await OTP_TOKEN(number);
    let response = await UserSave(number);
    console.log("------User---", response);
    return res.status(200).json({
      status: true,
      data: { message: "Please Enter your OTP " },
    });
  } else
    return res.status(404).json({ status: false, error: "Invalid Number" });
});

module.exports = UserRoute;
