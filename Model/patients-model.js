const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const validator = require("validator");
const slugify = require("slugify");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userDel: {
      type: mongoose.Schema.ObjectId,
      ref: "UserList",
    },
    phoneNum: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    healthIssu: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    userPhoto: {
      type: String,
      default: null,
    },
    userPdf: {
      type: String,
      default: null,
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

patientSchema.virtual("myAppoinments", {
  ref: "AppointmentsTable",
  foreignField: "patientData",
  localField: "_id",
});

patientSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const patients = mongoose.model("PatientsList", patientSchema);

module.exports = patients;
