var ObjectId = require("mongodb").ObjectID;
const Package = require("../models/Package");

module.exports.addPackage = async (req, res) => {
  const { start_date, end_date, price } = req.body;
  try {
    if (start_date === "") {
      res.status(400).json({ msg: "start date is required" });
    }
    if (end_date === "") {
      res.status(400).json({ msg: "end date is required" });
    }
    if (price === "") {
      res.status(400).json({ msg: "price is required" });
    } else {
      const addPackage = await Package.create({
        start_date,
        end_date,
        price,
      });
      res.status(200).json({ msg: "Package successfully submitted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports.getPackage = async (req, res) => {
  try {
    const getPackage = await Package.find({});
    return res.status(200).json(getPackage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports.updatePackage = async (req, res) => {
  const { start_date, end_date, price } = req.body;
  try {
    if (start_date === "") {
      res.status(400).json({ msg: "start date is required" });
    }
    if (end_date === "") {
      res.status(400).json({ msg: "end date is required" });
    }
    if (price === "") {
      res.status(400).json({ msg: "price is required" });
    } else {
      const updateBrand = await Package.findByIdAndUpdate(
        { _id: ObjectId(req.params.id) },
        {
          start_date,
          end_date,
          price,
        }
      );
      res.status(200).json({ msg: "Package successfully Updated" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports.deletePackage = async (req, res) => {
  try {
    const getPackage = await Package.findByIdAndRemove({
      _id: ObjectId(req.params.id),
    });
    return res.status(200).json({ msg: "Package successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};
