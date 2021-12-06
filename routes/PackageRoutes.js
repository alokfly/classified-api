const app = require("express");
const router = app.Router();
const {
  addPackage,
  getPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/PackageController");

router.post("/addPackage", addPackage);
router.get("/getPackage", getPackage);
router.patch("/updatePackage/:id", updatePackage);
router.delete("/deletePackage/:id", deletePackage);

module.exports = router;
