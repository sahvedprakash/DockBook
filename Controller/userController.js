const users = require("./../Model/user-model");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const sendVerifyMail = async (userEmail, userid) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "docbookofficial2022@gmail.com",
        pass: "DocBook@2022",
      },
    });
    const mailOptions = {
      from: "ADMIN <docbookofficial2022@gmail.com>",
      to: userEmail,
      subject: "Email Verification",
      html: `<p>Welcome to DocBook world <br> User Security is priority <br> So Please Click the link below to verify your email <br>
      <h3><a href="http://127.0.0.1:2050/veryfi?id=${userid}">Please Click here to verify</a></h3>
      </p>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Send", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.singUpForm = async (req, res, next) => {
  res.status(200).render("regpage", {
    title: "DocBook || Registration",
  });
};

exports.singUp = async (req, res, next) => {
  const checkMail = await users.findOne({ email: req.body.email });
  if (checkMail) {
    res.status(203).send("Email Already Used");
    next();
  } else {
    const user = new users({
      email: req.body.email,
      password: req.body.password,
      confirmPass: req.body.cPassword,
      role: req.body.role,
    });
    const addUser = await user.save();

    if (addUser) {
      sendVerifyMail(req.body.email, addUser._id);
      res
        .status(200)
        .send("<h3>Please Check your email to verify your email address</h3>");
      console.log(addUser);
    } else {
      res.status(203).send("something went wrong");
    }
  }

  // const token = jwt.sign({ id: addUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXP_IN,
  // });

  // res.cookie("jwt", token, {
  //   expires: new Date(Date.now() + 60 * 60 * 1000),
  //   httpOnly: true,
  // });

  // console.log(token);
  // console.log(addUser.id);

  // if (req.body.role === "doctor") {
  //   res.status(200).redirect("/doctor/add-doctor");
  // } else {
  //   res.status(200).redirect("/patient/add-profile");
  // }
};

exports.verifyMail = async (req, res, next) => {
  try {
    const updateUser = await users.updateOne(
      { _id: req.query.id },
      {
        $set: {
          isVarified: true,
        },
      }
    );
    console.log(req.query.id);
    console.log(updateUser);
    res.status(200).render("verifyEmail", {
      title: "DocBook ||verify Email",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res, next) => {
  const user = await users.findById(req.params.id).populate({
    path: "userInfo patientInfo",
  });

  res.status(200).json({
    data: user,
  });
};

exports.logInform = async (req, res, next) => {
  try {
    res.status(200).render("logIn", {
      title: "DocBook || Log-in",
    });
  } catch (error) {
    error.message;
  }
};

exports.authRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.redirect("/");
      } else {
        // console.log(decode);
        next();
      }
    });
  } else {
    res.redirect("/user/log-In");
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userLogIn = await users.findOne({ email }).select("+password");
    if (
      !userLogIn ||
      !(await userLogIn.comparePass(password, userLogIn.password))
    ) {
      console.log("User Not registered");
      res.status(200).redirect("/user/log-In");
    } else {
      const token = jwt.sign({ id: userLogIn._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP_IN,
      });

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
        httpOnly: true,
      });
      if (userLogIn.isCompleted === false) {
        if (userLogIn.role === "doctor") {
          res.status(200).redirect("/doctor/add-doctor");
        } else {
          res.status(200).redirect("/patient/add-profile");
        }
      } else {
        if (userLogIn.role === "doctor") {
          res.status(200).redirect("/doctor/profile");
        } else {
          res.status(200).redirect("/");
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.regForm = async (req, res, next) => {
  try {
    res.status(200).render("docinput");
  } catch (error) {
    error.message;
  }
};

exports.authPer = (role) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);
    const userRole = await users.findById(user.id);
    if (role !== userRole.role) {
      // return next(new AppError('Request Denied', 403));
      return res.status(403).render("unauthorized", {
        title: "DocBook || unauthorized access",
      });
    }

    next();
  };
};

exports.logOut = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/user/log-in");
};
