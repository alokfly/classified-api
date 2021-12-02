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
    const ads = await Add.find({ userId: ObjectId(req.user) });
    return res.status(200).json(ads);
  } catch (error) {
    console.log(error);
  }
};

module.exports.pendingAds = async (req, res) => {
  try {
    const pendingAds = await Add.find({
      userId: ObjectId(req.user),
      status: 2,
    });
    return res.status(200).json(pendingAds);
  } catch (error) {
    console.log(error);
  }
};

module.exports.likeAd = async (req, res) => {
  const { addId } = req.body;
  await Add.findByIdAndUpdate(
    { _id: ObjectId(addId) },
    {
      $push: { like: req.user },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      console;
      return res.status(422).json(err);
    } else {
      res.json(result);
    }
  });
};

module.exports.getLikedAds = async (req, res) => {
  try {
    const getLikedAds = await Add.find({
      like: { $in: ObjectId(req.user) },
    });
    return res.status(201).json(getLikedAds);
  } catch (error) {
    console.log(error);
  }
};

module.exports.hideAd = async (req, res) => {
  const { addId } = req.body;
  await Add.findByIdAndUpdate(
    { _id: ObjectId(addId) },
    {
      $push: { adHiddenFromUser: req.user },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      console;
      return res.status(422).json(err);
    } else {
      res.json(result);
    }
  });
};

module.exports.getHiddenAds = async (req, res) => {
  try {
    const getHiddenAds = await Add.find({
      adHiddenFromUser: { $in: ObjectId(req.user) },
    });
    return res.status(201).json(getHiddenAds);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllAds = async (req, res) => {
  try {
    const getAllAds = await Add.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "adHiddenFromUser",
          foreignField: "_id",
          as: "fromItems",
        },
      },
      {
        $match: {
          $expr: {
            $eq: [{ $size: "$fromItems" }, 0],
          },
        },
      },
    ]);
    return res.status(201).json(getAllAds);
  } catch (error) {
    console.log(error);
  }
};
