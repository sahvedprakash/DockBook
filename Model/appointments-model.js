const mongoose = require("mongoose");

const appoinmentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
    },
    contactNo: {
      type: Number,
    },
    patientName: {
      type: String,
    },
    patientData: {
      type: mongoose.Schema.ObjectId,
      ref: "PatientsList",
      // required:true
    },
    healthIssu: {
      type: String,
    },
    doctorData: {
      type: mongoose.Schema.ObjectId,
      ref: "AllDoctorList",
      // required:true
    },
    chamberData: {
      type: mongoose.Schema.ObjectId,
      ref: "ChamberList",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// appoinmentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "appointmentData",
//   });
//   next();
// });
// appoinmentSchema.pre('aggregate', function (next) {
//     this.populate({
//         path: 'patientsData'
//     });
//     next();
// })

const appointments = mongoose.model("AppointmentsTable", appoinmentSchema);

module.exports = appointments;
