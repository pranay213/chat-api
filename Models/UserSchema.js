const mongoose = require("mongoose");
const { OTP_TOKEN, TokenExpiry } = require("../Functions/User");
const { response } = require("express");
const UserSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    otp_hash: { type: String },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", UserSchema);

UserModel.createCollection();

const findUserbyNumber = async (number) => {
  try {
    if (number) {
      let res = await UserModel.find({ number });
      return res;
    } else {
    }
  } catch (err) {
    console.log(err);
  }
};

const UpdateById = async (id, update) => {
  try {
    let res = await UserModel.findByIdAndUpdate(id, update);
    return res;
    console.log("Response After Update", res);
  } catch (err) {
    console.log(err);
    return false;
  }
};

const UserSave = async (number, otp_hash) => {
  try {
    // let otp_hash = await OTP_TOKEN(number);
    let res = await findUserbyNumber(number);
    if (res.length) {
      const { id, number, otp_hash } = res[0];
      const tokenResponse = await TokenExpiry(otp_hash);
      // console.log(tokenResponse);
      if (tokenResponse) {
        const { exp } = tokenResponse;
        console.log("Times", exp, (new Date().getTime() + 1) / 1000);
        if (exp > (new Date().getTime() + 1) / 1000) {
          return { status: false, message: "Please try after some time" };
        } else {
          let otp_hash = await OTP_TOKEN(number);
          let res = await UpdateById(id, {
            number: number,
            otp_hash: otp_hash,
          });
          if (res) {
            return { status: true, message: "Send Otp successfully" };
          }
        }
      } else {
        let otp_hash = await OTP_TOKEN(number);
        let res = UpdateById(id, { number: number, otp_hash: otp_hash });
        return { status: true, message: "Send OTP successfully" };
      }

      //   await UpdateById(id, { number, otp_hash });
    } else {
      let otp_hash = await OTP_TOKEN(number);
      // console.log("New User creation");
      const newUser = new UserModel({ number, otp_hash });
      let res = await newUser.save().then((res) => console.log(res));
      if (res) {
        return { status: true, message: "Send OTP successfully" };
      }
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = UserModel;
module.exports = { UserSave };
