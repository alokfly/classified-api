const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var ObjectId = require("mongodb").ObjectID;

const User = require("../models/User");
const Otp = require("../models/Otp");
require("dotenv").config();

const createToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

module.exports.registerValiations = [
  body("username").not().isEmpty().trim().withMessage("username is required"),
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("phone").not().isEmpty().trim().withMessage("Phone is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters long"),
];

module.exports.register = async (req, res) => {
  const { username, email, password, phone } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email is already taken" }] });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
      const user = await User.create({
        username,
        email,
        password: hash,
        phone,
      });
      const token = createToken(user);
      return res.status(200).json({
        msg: "Your account has been created",
        user,
        token,
      });
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.loginValiations = [
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = createToken(user);
        return res
          .status(200)
          .json({ msg: "You have loggedin successfully", token });
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: "Password is not correct" }] });
      }
    } else {
      return res.status(404).json({ errors: [{ msg: "Email not found" }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.loggedUserDetail = async (req, res) => {
  try {
    const loggedUserDetail = await User.findById({ _id: ObjectId(req.user) });
    res.status(200).json(loggedUserDetail);
  } catch (error) {
    console.log(error);
  }
};

module.exports.emailSend = async (req, res) => {
  const { email } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      let otpData = new Otp({
        email,
        code: Math.floor(100000 + Math.random() * 900000),
        expireIn: new Date().getTime() + 300 * 1000,
      });

      let optResponse = await otpData.save();
      mailer(email, otpData.code);
      return res.status(200).json({ msg: "OTP sended to your mail" });
    } else {
      return res.status(400).json({ errors: [{ msg: "Email not exist" }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.changePassword = async (req, res) => {
  let data = await Otp.find({ email: req.body.mail, code: req.body.code });
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      return res.status(400).json({ errors: [{ msg: "Token expire" }] });
    } else {
      let user = await User.findOne({ email: req.body.email });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user.password = hash;
      user.save();
      return res.status(200).json({ msg: "Password changes successfully" });
    }
  } else {
    return res.status(400).json({ errors: [{ msg: "Token Expired" }] });
  }
};

const mailer = (email, otp) => {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "arijithajra62@gmail.com",
      pass: "gdruocofmzahwsdn",
    },
  });
  var mailOptions = {
    from: "arijithajra62@gmail.com",
    to: email,
    subject: "OTP mail",
    text: otp,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.editUser = async (req, res) => {
  const {
    username,
    email,
    phone,
    aboutUs,
    address,
    name,
    website,
    facebook,
    instagram,
    currentPassword,
    newPassword,
    currentImage,
  } = req.body;
  const userImage = req.file ? req.file.path : currentImage;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email is already taken" }] });
    }
    try {
      if (currentPassword != null && newPassword != null) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        const user = await User.findOneAndUpdate(
          { _id: ObjectId(req.user) },
          {
            username,
            email,
            phone,
            aboutUs,
            address,
            name,
            website,
            facebook,
            instagram,
            image: userImage,
            password: hash,
          }
        );
        return res.status(200).json({ msg: "Your password has been updated" });
      } else {
        const user = await User.findByIdAndUpdate(
          { _id: ObjectId(req.user) },
          {
            username,
            email,
            phone,
            aboutUs,
            address,
            name,
            website,
            facebook,
            instagram,
            image: userImage,
          }
        );
        return res.status(200).json({
          msg: "Your Profile edited successfully",
          user,
        });
      }
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.showAllUser = async (req, res) => {
  try {
    const getAllUser = await User.find({});
    return res.status(200).json(getAllUser);
  } catch (error) {
    console.log(error);
  }
};
