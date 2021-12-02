const app = require("express");
const router = app.Router();
const auth = require("../utils/auth");

var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });

const {
  register,
  registerValiations,
  login,
  loginValiations,
  loggedUserDetail,
  editUser,
} = require("../controllers/UserController");
router.post("/register", registerValiations, register);
router.post("/login", loginValiations, login);
router.get("/loggedUserDetail", auth, loggedUserDetail);
router.post("/editUser", upload.single("myField"), auth, editUser);

module.exports = router;
