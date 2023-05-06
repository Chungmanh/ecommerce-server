const categoryModel = require("../models/category.model");
const { uploadFile } = require("../services/firebase");

exports.addcategory = async (req, res) => {
  try {
    //Create new category
    const category = req.body;
    const file = req.file;

    const { _id, ...other } = category;
    console.log("category: ", category);
    const obj = {
      ...other,
    };

    if (file) {
      const url_file = await uploadFile(file, "category");
      obj.avatar = url_file;
    }

    if (_id) {
      const updated = await categoryModel.findByIdAndUpdate(_id, obj);
      return res.status(200).json("updated");
    }

    const created = new categoryModel(obj);
    created.save();

    return res.status(200).json("created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getCategoryById = async (id) => {
  try {
    const category = await categoryModel.findById(id, {}, { lean: true });
    return category;
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.deleteCategory = async (id) => {
  try {
    const deleted = await categoryModel.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    console.log(error);
    return {};
  }
};
