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
  addAd,
  getAdDetail,
  editAd,
  deleteAd,
  myAds,
  pendingAds,
} = require("../controllers/AddController");

router.post("/addAd", upload.single("myField"), auth, addAd);
router.get("/getAdDetail", getAdDetail);
router.post("/editAd/:id", upload.single("myField"), auth, editAd);
router.get("/deleteAd/:id", deleteAd);
router.get("/myAds", auth, myAds);
router.get("/pendingAds", auth, pendingAds);

module.exports = router;
