const Add = require("../models/Add");
const ExpiryAd = require("../models/ExpiryAd");
var ObjectId = require("mongodb").ObjectID;
const cron = require("node-cron");

module.exports.addAd = async (req, res) => {
  const addImage = req.file ? req.file.path : null;
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  const date = d.toLocaleDateString();
  const {
    category,
    subCategory,
    title,
    description,
    adType,
    price,
    mobileNumber,
    location,
    negotitate,
    tag,
    adsPremium,
  } = req.body;
  try {
    const add = await Add.create({
      userId: req.user,
      category,
      subCategory,
      title,
      description,
      adType,
      price,
      mobileNumber,
      location,
      negotitate,
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
    category,
    subCategory,
    title,
    description,
    adType,
    price,
    mobileNumber,
    location,
    negotitate,
    tag,
    adsPremium,
    currentImage,
  } = req.body;
  const addImage = req.file ? req.file.path : currentImage;
  try {
    const edit = await Add.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        category,
        subCategory,
        title,
        description,
        adType,
        price,
        mobileNumber,
        location,
        negotitate,
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

module.exports.approveAd = async (req, res) => {
  try {
    const approveStatus = await Add.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        status: 1,
      }
    );
    res.status(200).json({ msg: "Ad successfully approved" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.rejectAd = async (req, res) => {
  try {
    const approveStatus = await Add.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        status: 0,
      }
    );
    res.status(200).json({ msg: "Ad successfully rejected" });
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("00 00 12 * * 0-6", async () => {
  const getData = await Add.find({});
  getData.forEach(async (item) => {
    if (item) {
      if (item.expiryDate === item.date) {
        const expiryAd = await ExpiryAd.create({
          adId: item._id,
          userId: item.userId,
          category: item.category,
          subCategory: item.subCategory,
          title: item.title,
          description: item.description,
          adType: item.adType,
          price: item.price,
          mobileNumber: item.mobileNumber,
          location: item.location,
          negotitate: item.negotitate,
          tag: item.tag,
          adsPremium: item.adsPremium,
          image: item.image,
        });
        const removeAd = await Add.findByIdAndRemove({
          _id: ObjectId(item._id),
        });
        console.log("add remove done");
      } else {
        console.log("date not matched");
      }
    } else {
      console.log("No Expiry Ad");
    }
  });
});

module.exports.getExpiryAds = async (req, res) => {
  try {
    const getAds = await ExpiryAd.find({ userId: req.user });
    return res.status(200).json(getAds);
  } catch (error) {
    console.log(error);
  }
};
