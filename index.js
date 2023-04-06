const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRoute = require("./Routes/UserRoute");
const { SMS_API_URL, SMS_API_AUTH, PORT, DB } = require("./Constants/index");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
//port
//db connection
mongoose.connect(DB);

app.use("/api/users", UserRoute);
app.listen(PORT, () => {
  console.log(
    "Sever is Running at location of node test  http://localhost:" + PORT
  );
});
