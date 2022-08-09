const chamber = require("./../Model/chamber-model");
const doctor = require("./../Model/doc-sec-model");
const appointTable = require("./../Model/appointments-model");
const userTable = require("./../Model/user-model");
const patient = require("./../Model/patients-model");

exports.getBookingForm = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);
    const userData = await userTable
      .findById(user.id)
      .populate({ path: "patientInfo" });

    const patientId = userData.patientInfo[0];
    // console.log(userData);

    const doctorData = await doctor
      .findOne({ slug: req.params.slug })
      .populate({ path: "chambers" });
    const chamberData = await chamber.findById(req.params.id);
    // console.log(doctorData);
    // console.log(chamberData);
    // console.log(user);
    const doc = doctorData;
    const cham = chamberData;

    res.status(200).render("book-app", {
      doc,
      cham,
      userData,
      mess: " ",
      errorMsg: req.flash("message"),
      title: "DocBook || Book Appoinment",
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.bookAppoint = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);

    const userData = await userTable
      .findById(user.id)
      .populate({ path: "patientInfo" });
    const patientId = userData.patientInfo[0].id;
    const doctorID = await doctor.findOne({ slug: req.params.slug });
    const chamberData = await chamber.findById(req.params.id);
    console.log(patientId);

    const docId = doctorID.id;
    const cham = chamberData;

    let today = new Date().toLocaleDateString("en-CA");
    let checkDate = req.body.appDate;
    let bookDate = new Date(req.body.appDate).toDateString();
    console.log(bookDate);

    let day = bookDate.split(" ");
    let weekDay = day[0].toLocaleLowerCase();

    if (today > checkDate) {
      req.flash("message", "Date cannot be in past");
      res.redirect("back");
    } else if (chamberData[weekDay][2] === "off-day") {
      req.flash("message", "Doctor will not be available on this day");
      res.redirect("back");
    } else {
      const appBook = await appointTable.create({
        date: req.body.appDate,
        address: req.body.patientAddress,
        contactNo: req.body.patientPhone,
        patientName: req.body.patientName,
        healthIssu: req.body.healthIssue,
        doctorData: docId,
        patientData: patientId,
        chamberData: req.params.id,
      });

      // res.redirect("back");
      // console.log("Appointment Booked");
      req.flash("message", "Appointment Booked successfully");
      res.redirect("/");
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.cancelApp = async (req, res, next) => {
  const item = await appointTable.findOneAndDelete(req.params.id);
  res.status(200).redirect("back");
};
