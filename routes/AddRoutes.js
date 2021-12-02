const app = require("express");
const router = app.Router();

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
  addAd,
  getAdDetail,
  editAd,
  deleteAd,
} = require("../controllers/AddController");

router.post("/addAd", upload.single("myField"), addAd);
router.get("/getAdDetail", getAdDetail);
router.post("/editAd/:id", upload.single("myField"), editAd);
router.get("/deleteAd/:id", deleteAd);

module.exports = router;
