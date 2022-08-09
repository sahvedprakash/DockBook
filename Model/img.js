const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Enter your name"],
  },
  imgUpload: {
    type: String,
  },
});

const img = mongoose.model("ImgList", testSchema);

module.exports = img;
