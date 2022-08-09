const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect("mongodb://localhost:27017/capstoneDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Succesfully established with DataBase"));

const port = 2050;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
