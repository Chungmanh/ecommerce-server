const shopModel = require("../models/shop.model");
const { uploadFile } = require("../services/firebase");

exports.updateAvatar = async (shopId, file) => {
  try {
    if (file) {
      const url_file = await uploadFile(file, "shop");
      const updated = await shopModel.findByIdAndUpdate(
        shopId,
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

exports.getAllShops = async () => {
  try {
    const shops = await shopModel.find({}, {}, { lean: true });
    return shops;
  } catch (error) {
    console.log(error);
  }
};

exports.getShopByUserId = async (userId) => {
  try {
    const shop = await shopModel.findOne(
      { userId: userId },
      {},
      { lean: true }
    );
    return shop;
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.updateShopByUserId = async (userId, shop) => {
  try {
    const updated = await shopModel.findOneAndUpdate({ userId: userId }, shop, {
      new: true,
    });
    return updated;
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getShopById = async (id) => {
  try {
    const shop = await shopModel.findById(id, {}, { lean: true });
    return shop;
  } catch (error) {
    console.log(error);
    return {};
  }
};
