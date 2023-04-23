const categoryModel = require("../models/category.model");

exports.addcategory = async (req, res) => {
  try {
    //Create new category
    const category = req.body;
    console.log("category: ", category);
    const created = await categoryModel.create(category);
    res.status(200).json(created);
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
