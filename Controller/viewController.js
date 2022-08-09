const doctors = require("../Model/doc-sec-model");
const chambers = require("../Model/chamber-model");
const patients = require("../Model/patients-model");
const users = require("./../Model/user-model");
const appointments = require("../Model/appointments-model");
const mongoose = require("mongoose");
const { findOne } = require("../Model/appointments-model");
const url = require("url");
const fetch = require("node-fetch");
const res = require("express/lib/response");

exports.getall = async (req, res, next) => {
  try {
    const doctorList = await doctors.find().populate("userDel");

    const List = doctorList.patients;

    const getdata = await fetch("https://data.covid19india.org/data.json");
    const resp = await getdata.json();
    const allRes = resp;

    let data = allRes.cases_time_series[564];

    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);
    const UserId = mongoose.mongo.ObjectId(user.id);

    const patient = await users
      .findById(user.id)
      .populate({ path: "patientInfo" });
    const pat = patient.patientInfo[0];

    res.status(200).render("index", {
      doctorList,
      data,
      pat,
      message: req.flash("message"),
      title: "DocBook || Home",
    });

    // res.status(200).json({
    //     message: "New List",
    //     doctorList
    // });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

// exports.getSingle = async (req, res, next) => {
//   try {
//     const oneDoc = await doctors
//       .findOne({ slug: req.params.slug })
//       .populate({
//         path: "myAppoinments",
//         populate: {
//           path: "patientsData",
//         },
//       })
//       .populate("chambers");

//     // res.status(200).json({
//     //     message: "Show data",
//     //     oneDoc
//     // });

//     // console.log(oneDoc);

//     let DocName = oneDoc.name;
//     res.status(200).render("docpage", {
//       oneDoc,
//       DocName,
//     });
//   } catch (error) {
//     error.message;
//   }
// };

// exports.docform = async (req, res, next) => {
//   res.status(200).render("docInput");
// };

// exports.addDoctor = async (req, res, next) => {
//   try {
//     const AddnewDoc = new doctors({
//       name: req.body.name,
//       email: req.body.email,
//       details: req.body.details,
//       specilized: req.body.specilized,
//     });
//     const addDoc = await AddnewDoc.save();
//     console.log("Testing");

//     res.status(200).redirect("/");
//   } catch (error) {
//     error.message;
//   }
// };

// exports.addPatients = async (req, res, next) => {
//   try {
//     const addpati = await patients.create(req.body);

//     res.status(201).json({
//       message: "Add successful",
//       addpati,
//     });
//   } catch (error) {
//     error.message;
//   }
// };

// exports.getAllAppoint = async (req, res, next) => {
//   try {
//     const allAppoinetments = await appointments
//       .find()
//       .populate("doctorData patientsData");

//     res.status(200).json({
//       message: "All Appoinments",
//       data: allAppoinetments,
//     });
//   } catch (error) {
//     error.message;
//   }
// };

// exports.appoint = async (req, res, next) => {
//   try {
//     // if (!req.body.doctorData) req.body.doctorData= req.params.id;

//     let docIdE = await doctors.findOne({ slug: req.params.slug }).populate({
//       path: "myAppoinments",
//       populate: {
//         path: "patientsData",
//       },
//     });

//     let docId = docIdE.id;

//     let singleInfo = docIdE.myAppoinments;
//     let paArr = [];
//     let checkDate = req.body.date.toLocaleString();
//     console.log(checkDate);
//     for (let i = 0; i < singleInfo.length; i++) {
//       let appDate = singleInfo[i].date.toLocaleDateString("en-CA");
//       // console.log(appDate[0]);
//       if (appDate == checkDate) {
//         paArr.push(singleInfo[i].patientsData);
//       }
//     }
//     console.log(paArr.length);

//     let today = new Date();

//     let date = today.getDate();
//     let month = today.getMonth() + 1;
//     let year = today.getFullYear();

//     if (date < 10 || month < 10) {
//       date = `0${date}`;
//       month = `0${month}`;
//     }

//     let dateFormat = year + "-" + month + "-" + date;

//     let errMsg;

//     if (dateFormat > req.body.date) {
//       errMsg = "Please Setect a date which is greater than today";
//     } else {
//       const TakeAppoint = await appointments.create({
//         date: req.body.date.toLocaleString(),
//         patientsData: req.body.pid,
//         doctorData: docId,
//       });
//     }

//     const pat = await doctors.findOne({ slug: req.params.slug });
//     res.render("book-appointment", {
//       pat,
//       errMsg,
//     });

//     // console.log(req.body.date);
//     // console.log(dateFormat);
//     // console.log(req.body.pid);
//     // console.log(req.params);
//     res.status(200).redirect(req.param.slug);
//     // res.status(201).json({
//     //     message: "Appointment Booked",
//     //     det:TakeAppoint
//     // })
//   } catch (error) {
//     error.message;
//   }
// };

// exports.bookForm = async (req, res, next) => {
//   const pat = await doctors.findOne({ slug: req.params.slug });
//   let errMsg;
//   res.render("book-appointment", {
//     pat,
//     errMsg,
//   });
// };

// exports.chm = async (req, res, next) => {
//   res.send("<h1>Booking is Processing</h1>");
//   let docID = req.params.slug2;
//   let docSlug = req.params.slug1;

//   // console.log(docID);
//   // console.log(docSlug);
// };

// exports.chmIn = async (req, res, next) => {
//   const doctor = await doctors.findOne({ slug: req.params.slug });

//   console.log(req.params.slug);
//   // console.log(doctor);
//   const slug = doctor.slug;
//   res.status(200).render("chem-add", {
//     slug,
//   });
// };

// exports.addCham = async (req, res, next) => {
//   const dco = await doctors.findOne({ slug: req.params.slug });

//   const objDoc = dco.id;

//   const chamAdd = await chambers.create({
//     chamberName: req.body.name,
//     address: req.body.address,
//     dailyLimit: req.body.limit,
//     doctorIn: objDoc,
//   });

//   // console.log(chamAdd);
//   // console.log(dco);
//   // console.log(req.params.slug);

//   res.status(200).redirect(`/${req.params.slug}/add-chamber`);
// };

// exports.chamberInfo = async (req, res, next) => {
//   const allPat = await appointments.find().populate("patientsData");

//   const patDel = allPat.patientsData;
//   res.status(200).render("cham-del", {
//     allPat,
//     patDel,
//   });
// };

// exports.limit = async (req, res, next) => {
//     const aggDoc = await doctors.findOne({ slug: 'zinnur-radia' }).populate({
//         path: 'myAppoinments',
//         populate: {
//             path: 'patientsData',
//             select: '-myAppoinments'
//         }
//     });

//     let singleInfo = aggDoc.myAppoinments;
//     let paArr =[]

//     for (let i = 0; i < singleInfo.length; i++){
//         let appDate = singleInfo[i].date.toLocaleDateString('en-CA');
//         console.log(appDate)
//         if (appDate == '19/2/2022') {
//             paArr.push(singleInfo[i].patientsData);
//         }
//     }
//     console.log(paArr.length);

//     // console.log(aggDoc.myAppoinments[1]);
//     res.send('Test Limting');
// }

// exports.limit = async (req, res, next) => {

//     const dailyLimit = await appointments.aggregate([
//         {
//             $group: {
//                 _id: '$doctorData',
//                 patients: {
//                     $push: '$patientsData',
//                 },
//                 date: { $push: '$date' }
//             }
//         },
//         {
//             $project: {
//                 date: { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
//                 patients: 1,
//                 totalPatients: { $cond: { if: { $isArray: '$patients' }, then: { $size: '$patients' }, else: 'NA' } },
//                 doctors:'$_id',
//                 _id: 0
//             }
//         },
//         {
//             $lookup: {
//                 from: "PatientsList",
//                 localField: "patientsData",
//                 foreignField: "_id",
//                 as: 'Patients_list'
//             }
//         }
//     ]);

//     await patients.populate(dailyLimit, { path: 'patients', select: 'name' });
//     await doctors.populate(dailyLimit, { path: 'doctors', select: 'name' })

//     const sortList = await appointments.find().sort('date');

//     let limit = 2;

//     // let today = new Date().toLocaleDateString();
//     // console.log("Today :",today);

//     dailyLimit.forEach((aap => {
//         limitData = {
//             date: aap.date.toLocaleString(),
//             totalPaitents: aap.patients,
//             totalDocs: aap.doctors,
//             patientsLength: aap.totalPatients
//         }
//         // console.log(limitData)

//     }))

// var filterObj = dailyLimit.filter(function(e) {
//     if (e.date == '2022-02-12') {
//         console.log(e.patients)
//         console.log(e.doctors);
//     };
// });

// if (filterObj > 3) {
//     console.log("Plesase Select another day")
// }
// else {
//     console.log('Procced to Booking');
// }

//     console.log(dailyLimit);

//     res.send('Limiting');
// }
// console.log(typeof(limitData));

// console.log(limiting);
// console.log(dailyLimit[6].patients.length);

// exports.bookapp = async (req, res, next) => {

// if (!req.body.doctorData) req.body.doctorData = req.params.id;

// const makeApp = new appointments({
//     date: req.body.date,
//     patientsData: req.body._id
// });

// const bookDone = await makeApp.save();
//     console.log(req.body.id);
//     console.log(req.params.id);
//     console.log(req.body.data);
//     res.status(200).redirect('/');
// }

// try {
//     const addDot = await doctors.create(req.body);
//     res.status(201).json({
//         message: "Add successful",
//         addDot
// });
//     // const AddnewDoc = new doctors({
//     //     name: req.body.name,
//     //     email: req.body.email,
//     //     details: req.body.details,
//     //     specilized:req.body.specilized
//     // })
//     // const addDoc = await AddnewDoc.save();

//     // res.status(200).redirect('/');

// } catch (error) {
//    error.message
// }
