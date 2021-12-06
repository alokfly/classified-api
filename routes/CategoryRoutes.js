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
  addCategory,
  getCategory,
  editCategory,
  deleteCategory,

  addSubCategory,
  getSubCategory,
  editSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
} = require("../controllers/CategoryController");

router.post("/addCategory", upload.single("myField"), addCategory);
router.get("/getCategory", getCategory);
router.post("/editCategory/:id", upload.single("myField"), editCategory);
router.get("/deleteCategory/:id", deleteCategory);

router.post("/addSubCategory", upload.single("myField"), addSubCategory);
router.get("/getSubCategory", getSubCategory);
router.get("/getSubCategoryByCategoryId/:id", getSubCategoryByCategoryId);
router.post("/editSubCategory/:id", upload.single("myField"), editSubCategory);
router.get("/deleteSubCategory/:id", deleteSubCategory);

module.exports = router;
