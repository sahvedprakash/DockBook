const res = require("express/lib/response");
const doctors = require("./../Model/doc-sec-model");
const chamber = require("./../Model/chamber-model");
const users = require("./../Model/user-model");
const mongoose = require("mongoose");
const multer = require("multer");
const app = require("../app");
const newTest = require("./../Model/img");
const { redirect } = require("express/lib/response");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/");
  },
  filename: (req, file, cb) => {
    let extension = file.mimetype;
    extension = extension.substring(
      extension.indexOf("/") + 1,
      extension.length
    );
    let filename = file.fieldname + "-" + Date.now() + "." + extension;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("docPhoto");

exports.getform = async (req, res, next) => {
  const token = req.cookies.jwt;
  const tokenParts = token.split(".");
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  const UserId = mongoose.mongo.ObjectId(user.id);
  console.log("user id: " + UserId);
  const userRoute = await users.findById(user.id);
  console.log(userRoute);

  if (userRoute.isCompleted === true) {
    res.status(200).redirect("/doctor/profile");
  } else {
    res.status(200).render("docinput", {
      title: "DocBook || Doctor Registration",
    });
  }
  // console.log(req.body.user);
  // outputs 'bob
};

exports.addProfile = async (req, res, next) => {
  try {
    let spe = req.body.speciality;
    spe = spe.split(",");
    let links = [req.body.facebook, req.body.linkedIn];
    let school = [req.body.doc10year, req.body.doc10school, req.body.doc10per];
    let college = [req.body.doc12year, req.body.doc12school, req.body.doc12per];
    let mbbs = [
      req.body.docMBBSyear,
      req.body.docMBBSschool,
      req.body.docMBBSper,
    ];
    let others = [req.body.docEXyear, req.body.docEXschool, req.body.docEXper];

    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);
    const UserId = mongoose.mongo.ObjectId(user.id);
    console.log("user id: " + UserId);
    // console.log(req.userDel.id);

    // console.log(req.file);
    let imgName = req.file.filename;

    const doctor = await doctors.create({
      name: req.body.docName,
      phoneNum: req.body.docPhnNumber,
      dob: req.body.docDOB,
      userDel: user.id,
      gander: req.body.gander,
      address: req.body.docAddress,
      schoolInfo: school,
      collegeInfo: college,
      mbbsInfo: mbbs,
      otherDegInfo: others,
      extraQuility: req.body.extraQuality,
      workdPlace: req.body.docworkPlace,
      currentPosition: req.body.docPosition,
      tobTitle: req.body.docTitle,
      pastHistory: req.body.docHisotry,
      exprience: req.body.docExp,
      profileImg: imgName,
      specialties: spe,
      socialMedia: links,
    });

    const updateUser = await users.updateOne(
      { _id: UserId },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    // const doctor = await doctors.create(req.body);
    // console.log(doctor);
    // res.status(200).json({
    //   data: doctor,
    // });
    res.status(200).redirect("/doctor/profile");
  } catch (error) {
    console.log(error);
  }
};

exports.getDoc = async (req, res, next) => {
  const token = req.cookies.jwt;
  const tokenParts = token.split(".");
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  const userRole = await users.findById(user.id).populate({ path: "userInfo" });
  const userData = userRole.userInfo;
  const getDoctor = await doctors
    .findById(userData[0].id)
    .populate({ path: "userDel chambers" })
    .populate({ path: "myAppoinments", populate: { path: "chamberData" } });

  const doctorCham = getDoctor.chambers;

  const appointmentsData = getDoctor.myAppoinments.sort(function (a, b) {
    return a.date - b.date;
  });

  // console.log(
  //   appointmentsData.sort(function (a, b) {
  //     return a.date - b.date;
  //   })
  // );

  // console.log(userData[0]);
  res.status(200).render("docProfile", {
    getDoctor,
    doctorCham,
    appointmentsData,
    title: `DocBook || ${getDoctor.name}`,
  });
};

exports.getChamberForm = async (req, res, next) => {
  try {
    res.status(201).render("add-chamber", {
      title: "DocBook || Add Chamber",
    });
  } catch (error) {
    res.status(202).send(error.message);
  }
};

exports.addChamber = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);
    const userRole = await users
      .findById(user.id)
      .populate({ path: "userInfo" });
    const userData = userRole.userInfo;
    const getDoctor = await doctors
      .findById(userData[0].id)
      .populate({ path: "userDel" });

    const docId = getDoctor.id;

    const montime = [req.body.monstr, req.body.monend, req.body.monoffDay];
    const tuetime = [req.body.tuestr, req.body.tueend, req.body.tueoffDay];
    const wedtime = [req.body.wedstr, req.body.wedend, req.body.wedoffDay];
    const thutime = [req.body.thustr, req.body.thuend, req.body.thuoffDay];
    const fritime = [req.body.fristr, req.body.friend, req.body.frioffDay];
    const sattime = [req.body.satstr, req.body.satend, req.body.satoffDay];
    const suntime = [req.body.sunstr, req.body.sunend, req.body.sunoffDay];

    const createChamber = await chamber.create({
      chamberName: req.body.chamberName,
      contactNumber: req.body.chamberPhone,
      address: req.body.chamberAddress,
      doctorIn: docId,
      dailyLimit: req.body.chamberLimit,
      mon: montime,
      tue: tuetime,
      wed: wedtime,
      thu: thutime,
      fri: fritime,
      sat: sattime,
      sun: suntime,
    });

    res.status(201).redirect("/doctor/profile");
  } catch (error) {
    res.status(202).send(error.message);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);

    const userRole = await users
      .findById(user.id)
      .populate({ path: "patientInfo" });
    const pat = userRole.patientInfo[0];

    const doc = await doctors
      .findOne({ slug: req.params.slug })
      .populate({ path: "userDel chambers" });

    let chamList = doc.chambers;

    console.log(req.params.slug);
    res.status(200).render("docProfileO", {
      doc,
      chamList,
      pat,
      title: `DocBook || ${doc.name}`,
    });
  } catch (error) {
    res.status(202).send(error.message);
  }
};

exports.imgForm = (req, res, next) => {
  res.status(200).render("img", {
    title: "TEst",
  });
};
exports.imgAdd = async (req, res, next) => {
  const newImg = await newTest.create({
    name: req.body.name,
    imgUpload: req.file.filename,
  });
  console.log(newImg);
};

// const checkTime = (arr) => {
//   let visitTime;
//   if (arr[2] === null) {
//     visitTime = `${arr[0]}-${arr[1]}`;
//     return visitTime;
//   } else {
//     visitTime = "off-day";
//     return visitTime;
//   }
// };

// console.log(req.body.docName);
//   console.log(req.body.docPhnNumber);
//   console.log(req.body.docDOB);
//   console.log(req.body.gander);
//   console.log(req.body.docAddress);
//   console.log(req.body.facebook);
//   console.log(req.body.linkedIn);
//   console.log(req.body.doc10year);
//   console.log(req.body.doc10school);
//   console.log(req.body.doc10per);
//   console.log(req.body.doc12year);
//   console.log(req.body.doc12school);
//   console.log(req.body.doc12per);
//   console.log(req.body.docMBBSyear);
//   console.log(req.body.docMBBSschool);
//   console.log(req.body.docMBBSper);
//   console.log(req.body.docEXyear);
//   console.log(req.body.docEXschool);
//   console.log(req.body.docEXper);
//   console.log(req.body.extraQuality);
//   console.log(req.body.docPosition);
//   console.log(req.body.docworkPlace);
//   console.log(req.body.docHisotry);
//   console.log(req.body.docExp);
//   console.log(req.body.docTitle);
// let qua = [
//   {
//     name: req.body.doc10school,
//     year: req.body.doc10year,
//     percent: req.body.doc10per,
//   },
//   {
//     name: req.body.doc10school,
//     year: req.body.doc10year,
//     percent: req.body.doc10per,
//   },
// ];

// console.log(req.body.chamberName);
// console.log(req.body.chamberPhone);
// console.log(req.body.chamberAddress);
// console.log(docId);
// console.log(req.body.chamberLimit);
// console.log(montime, tuetime, wedtime, thutime);
// console.log(fritime, sattime, suntime);
