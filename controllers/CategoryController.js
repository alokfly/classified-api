const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

var ObjectId = require("mongodb").ObjectID;

module.exports.addCategory = async (req, res) => {
  const catImage = req.file ? req.file.filename : null;
  const { name } = req.body;
  try {
    const addCategory = await Category.create({
      name,
      iconImage: catImage,
    });
    res.status(200).json({ msg: "Category successfully added" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const getCategory = await Category.find({});
    res.status(200).json(getCategory);
  } catch (error) {
    console.log(error);
  }
};

module.exports.editCategory = async (req, res) => {
  const { name, currentImage } = req.body;
  const catImage = req.file ? req.file.path : currentImage;
  try {
    const editCategory = await Category.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        name,
        iconImage: catImage,
      }
    );
    res.status(200).json({ msg: "Category successfully edited" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndRemove({
      _id: ObjectId(req.params.id),
    });
    res.status(200).json({ msg: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addSubCategory = async (req, res) => {
  const catImage = req.file ? req.file.path : null;
  const { name, parentCategory } = req.body;
  try {
    const addSubCategory = await SubCategory.create({
      parentCategory,
      name,
      iconImage: catImage,
    });
    res.status(200).json({ msg: "SubCategory successfully added" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getSubCategory = async (req, res) => {
  try {
    const getSubCategory = await SubCategory.find({});
    res.status(200).json(getSubCategory);
  } catch (error) {
    console.log(error);
  }
};

module.exports.editSubCategory = async (req, res) => {
  const { name, currentImage, parentCategory } = req.body;
  const catImage = req.file ? req.file.path : currentImage;
  try {
    const editSubCategory = await SubCategory.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        parentCategory,
        name,
        iconImage: catImage,
      }
    );
    res.status(200).json({ msg: "SubCategory successfully edited" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteSubCategory = async (req, res) => {
  try {
    const deleteSubCategory = await SubCategory.findByIdAndRemove({
      _id: ObjectId(req.params.id),
    });
    res.status(200).json({ msg: "SubCategory deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
