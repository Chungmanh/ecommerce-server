const userModel = require("../models/user.model");
const { uploadFile } = require("../services/firebase");

exports.updateAvatar = async (userId, file) => {
  try {
    if (file) {
      const url_file = await uploadFile(file, "user");
      const updated = await userModel.findByIdAndUpdate(
        userId,
        {
          avatar: url_file,
        },
        { new: true }
      );
      return updated;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await userModel.find({}, {}, { lean: true });
    return users;
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId, {}, { lean: true });
    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserById = async (userId, username, address, telephone) => {
  try {
    const updated = await userModel.findByIdAndUpdate(
      userId,
      {
        username,
        address,
        telephone,
      },
      { new: true }
    );
    return updated;
  } catch (error) {
    console.log(error);
    return false;
  }
};
