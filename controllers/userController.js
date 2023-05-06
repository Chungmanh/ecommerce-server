const userModel = require("../models/user.model");

exports.getAllUsers = async () => {
  try {
    const users = await userModel.find({}, {}, { lean: true });
    return users;
  } catch (error) {
    console.log(error);
  }
};
