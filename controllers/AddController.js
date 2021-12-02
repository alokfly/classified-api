const Add = require("../models/Add");
var ObjectId = require("mongodb").ObjectID;

module.exports.addAd = async (req, res) => {
  const addImage = req.file ? req.file.path : null;
  const {
    title,
    description,
    category,
    subCategory,
    adType,
    brandName,
    yearOfRegistration,
    transmission,
    features,
    price,
    negotitate,
    mobileNumber,
    city,
    location,
    tag,
    adsPremium,
  } = req.body;
  try {
    const add = await Add.create({
      userId: req.user,
      title,
      description,
      category,
      subCategory,
      adType,
      brandName,
      yearOfRegistration,
      transmission,
      features,
      price,
      negotitate,
      mobileNumber,
      city,
      location,
      tag,
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
  const {
    title,
    description,
    category,
    subCategory,
    adType,
    brandName,
    yearOfRegistration,
    transmission,
    features,
    price,
    negotitate,
    mobileNumber,
    city,
    location,
    tag,
    adsPremium,
    currentImage,
  } = req.body;
  const addImage = req.file ? req.file.path : currentImage;
  try {
    const edit = await Add.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        title,
        description,
        category,
        subCategory,
        adType,
        brandName,
        yearOfRegistration,
        transmission,
        features,
        price,
        negotitate,
        mobileNumber,
        city,
        location,
        tag,
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
    const getAd = await Add.findByIdAndRemove({ _id: ObjectId(req.params.id) });
    res.status(200).json({ msg: "Ad successfully deleted" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.myAds = async (req, res) => {
  try {
    const ads = await Add.findById({ userId: req.user });
    return res.status(200).json(ads);
  } catch (error) {
    console.log(error);
  }
};
