const Add = require("../models/Add");
var ObjectId = require("mongodb").ObjectID;

module.exports.addAd = async (req, res) => {
  const addImage = req.file ? req.file.path : null;
  const { title, category, features, adsType, adsPremium } = req.body;
  try {
    const add = await Add.create({
      title,
      category,
      features,
      adsType,
      adsPremium,
      image: addImage,
    });
    res.status(200).json({ msg: "Add successfully added" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAdDetail = async (req, res) => {
  try {
    const getAd = await Add.find({});
    res.status(200).json(getAd);
  } catch (error) {
    console.log(error);
  }
};

module.exports.editAd = async (req, res) => {
  const { title, category, features, adsType, adsPremium, currentImage } =
    req.body;
  const addImage = req.file ? req.file.path : currentImage;
  try {
    const edit = await Add.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        title,
        category,
        features,
        adsType,
        adsPremium,
        image: addImage,
      }
    );
    res.status(200).json({ msg: "Ad successfully edited" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteAd = async (req, res) => {
  try {
    const deleteAd = await Add.findByIdAndRemove({
      _id: ObjectId(req.params.id),
    });
    res.status(200).json({ msg: "Add deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
