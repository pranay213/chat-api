import express from "express";
const app = express();
const port = 3000;
app.use(express());
app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.send({ Status: "Server is Running" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
