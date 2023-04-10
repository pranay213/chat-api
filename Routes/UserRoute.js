const express = require("express");
const { OTP_TOKEN, sendOtp, TokenVerify } = require("../Functions/User");
const { UserSave, findUserbyNumber } = require("../Models/UserSchema");

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
      response,
    });
  } else
    return res.status(404).json({ status: false, error: "Invalid Number" });
});

UserRoute.post("/verify-otp", async (req, res) => {
  console.log("Body", req.body);

  const { number, otp } = req.body;
  const regex = /^[6-9]\d{9}$/;
  const otpRegex = /^[0-9]{6}$/;

  if (regex.test(number)) {
    if (otpRegex.test(otp)) {
      let response = await findUserbyNumber(number);
      if (response.length) {
        const { id, otp_hash } = response[0];
        let tokenResponse = await TokenVerify(otp_hash, number, otp, id);
        if (tokenResponse) {
          return res.status(200).json(tokenResponse);
        } else {
          return res
            .status(201)
            .json({ status: false, message: "OTP IS EXPIRED" });
        }
      } else {
        return res
          .status(201)
          .json({ status: false, message: "Number Not found" });
      }
    } else
      return res.status(201).json({ status: false, message: "Invalid Otp" });
  } else
    return res.status(201).json({ status: false, message: "Invalid Number" });

  res.json({ status: true });
});

module.exports = UserRoute;
