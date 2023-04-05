const axios = require("axios");
const { SMS_API_URL, SMS_API_AUTH } = require("../Constants");
const wallet_balance = async () => {
  try {
    const response = await axios.get(
      `${SMS_API_URL}/wallet?authorization=${SMS_API_AUTH}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    // console.error(error);
    return error.data;
  }
};

const send_sms = async (number, OTP) => {
  console.log("---Number", number, "---Otp", OTP);
  try {
    const response = await axios.post(
      `${SMS_API_URL}/bulkV2`,
      {
        variables_values: OTP,
        route: "otp",
        numbers: number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: SMS_API_AUTH,
        },
      }
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error.data);
    return error.data;
  }
};

module.exports = { wallet_balance, send_sms };
