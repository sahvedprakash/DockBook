const express = require("express");
const bookController = require("../Controller/bookController");
const authController = require("./../Controller/userController");

const router = express.Router({ mergeParams: true });

router
  .route("/:slug/:id/book-appointment")
  .get(
    authController.authRoute,
    authController.authPer("g-user"),
    bookController.getBookingForm
  )
  .post(bookController.bookAppoint);

router.get("/cancel/:id", bookController.cancelApp);

module.exports = router;
