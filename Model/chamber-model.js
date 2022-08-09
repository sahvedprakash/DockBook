const mongoose = require("mongoose");

const chamberSchema = new mongoose.Schema(
  {
    chamberName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    doctorIn: {
      type: mongoose.Schema.ObjectId,
      ref: "AllDoctorList",
    },
    dailyLimit: {
      type: Number,
    },
    mon: [{ type: String }],
    tue: [{ type: String }],
    wed: [{ type: String }],
    thu: [{ type: String }],
    fri: [{ type: String }],
    sat: [{ type: String }],
    sun: [{ type: String }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const chambers = mongoose.model("ChamberList", chamberSchema);

module.exports = chambers;
