const mongoose = require("mongoose");
const slugify = require("slugify");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Enter your name"],
    },
    userDel: {
      type: mongoose.Schema.ObjectId,
      ref: "UserList",
    },
    phoneNum: {
      type: Number,
      // required: [true, "Enter Phone Number"],
    },
    dob: {
      type: Date,
      // required: [true, "Enter Date"],
    },
    gander: {
      type: String,
      enum: ["Male", "Female", "Others"],
      // required: [true, "Gender is required"],
    },

    address: {
      type: String,
      // required: [true, "Enter Address"],
    },

    schoolInfo: [{ type: String }],

    collegeInfo: [{ type: String }],

    mbbsInfo: [{ type: String }],

    otherDegInfo: [{ type: String }],

    extraQuility: {
      type: String,
    },

    workdPlace: {
      type: String,
      // required: [true, "Enter Position"],
    },
    currentPosition: {
      type: String,
      // required: [true, "Enter Position"],
    },
    pastHistory: {
      type: String,
      // required: [true, "Enter Position"],
    },
    tobTitle: {
      type: String,
      // required: [true, "Enter Jon title"],
    },
    exprience: {
      type: Number,
      // required: [true, "Enter Position"],
    },
    profileImg: {
      type: String,
    },

    specialties: [{ type: String }],

    socialMedia: [{ type: String }],

    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.virtual("patients", {
  ref: "PatientsList",
  foreignField: "doctorList",
  localField: "_id",
});

doctorSchema.virtual("myAppoinments", {
  ref: "AppointmentsTable",
  foreignField: "doctorData",
  localField: "_id",
});

doctorSchema.virtual("chambers", {
  ref: "ChamberList",
  foreignField: "doctorIn",
  localField: "_id",
});

doctorSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const doctors = mongoose.model("AllDoctorList", doctorSchema);

module.exports = doctors;
