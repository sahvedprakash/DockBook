const express = require("express");
const userController = require("./../Controller/userController");

const router = express.Router();

router
  .route("/user/registration")
  .get(userController.singUpForm)
  .post(userController.singUp);

router
  .route("/user/log-In")
  .get(userController.logInform)
  .post(userController.logIn);
router.route("/user/:id").get(userController.getUser);
router.route("/veryfi").get(userController.verifyMail);

module.exports = router;
