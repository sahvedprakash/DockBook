const express = require("express");
const patientController = require("./../Controller/patientController");
const authController = require("./../Controller/userController");
const UploadController = require("./../utils/fileUpload");

const router = express.Router();

router
  .route("/patient/add-profile")
  .get(
    authController.authRoute,
    authController.authPer("g-user"),
    patientController.getPatientForm
  )
  .post(
    UploadController.upload.single("userPhoto"),
    patientController.addPatientForm
  );
router
  .route("/patient/my-profile")
  .get(
    authController.authRoute,
    authController.authPer("g-user"),
    patientController.getProfile
  );

// router.route("/patient/new-profile").get(patientController.userPro);

module.exports = router;
