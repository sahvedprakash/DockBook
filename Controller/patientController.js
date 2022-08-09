const { param } = require("../routs/viewRout");
const generalUser = require("./../Model/patients-model");
const users = require("./../Model/user-model");

exports.getPatientForm = (req, res, next) => {
  res.status(200).render("patient-form", {
    title: "DocBook || G-user Registration",
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);

    const userRole = await users
      .findById(user.id)
      .populate({ path: "patientInfo" });
    const userData = userRole.patientInfo;
    const userInfo = await generalUser
      .findById(userData[0].id)
      .populate({ path: "userDel" });

    const appData = await generalUser.findById(userData[0].id).populate({
      path: "myAppoinments",
      populate: {
        path: "doctorData chamberData",
      },
    });

    // for (let data of appData.myAppoinments) {
    //   console.log(data);
    // }
    const appointments = appData.myAppoinments;

    res.status(200).render("useProfile", {
      userInfo,
      appointments,
      title: `DocBook || ${userInfo.name}`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addPatientForm = async (req, res, next) => {
  const token = req.cookies.jwt;
  const tokenParts = token.split(".");
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);

  const patient = await generalUser.create({
    name: req.body.userName,
    userDel: user.id,
    phoneNum: req.body.userPhone,
    address: req.body.userAddress,
    gender: req.body.gander,
    userPhoto: req.file.filename,
    healthIssu: req.body.healthIssu,
  });
  const updateUser = await users.updateOne(
    { _id: user.id },
    {
      $set: {
        isCompleted: true,
      },
    }
  );

  console.log(patient);

  res.status(200).redirect("/");
};

// exports.userPro = async (req, res, next) => {
//   res.status(200).render("useProfile", {
//     title: "userPorfile",
//   });
// };
