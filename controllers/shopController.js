const shopModel = require("../models/shop.model");

exports.getAllShops = async () => {
  try {
    const shops = await shopModel.find({}, {}, { lean: true });
    return shops;
  } catch (error) {
    console.log(error);
  }
};
