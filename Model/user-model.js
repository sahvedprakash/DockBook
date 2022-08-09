const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      requried: true,
      lowercase: true,
      validate: [validator.isEmail],
    },
    password: {
      type: String,
      requried: true,
      minlength: [6, "Password length should be more than 6 character !"],
      select: false,
    },
    confirmPass: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password does not match !",
      },
    },
    role: {
      type: String,
      requried: true,
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("userInfo", {
  ref: "AllDoctorList",
  foreignField: "userDel",
  localField: "_id",
});
userSchema.virtual("patientInfo", {
  ref: "PatientsList",
  foreignField: "userDel",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPass = undefined;

  next();
});

userSchema.methods.comparePass = async function (givenPass, savePass) {
  return await bcrypt.compare(givenPass, savePass);
};

const users = mongoose.model("UserList", userSchema);

module.exports = users;
