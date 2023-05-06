const trademarkModel = require("../models/trademark.model");
const userModel = require("../models/user.model");

exports.createTrademark = async (trademarkName, userId) => {
  try {
    //Create new trademark
    const user = await userModel.findById(userId);
    const shopId = await user.getShopIdFromUser();

    if (shopId && trademarkName) {
      console.log("here");
      const trademark = {
        name: trademarkName,
        shopId: shopId,
      };
      const created = new trademarkModel(trademark);
      created.save();
      return created;
    }

    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getTrademarkByUserId = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const shopId = await user.getShopIdFromUser();
    const trademarks = await trademarkModel.find(
      { shopId: shopId },
      {},
      { lean: true }
    );
    if (trademarks) {
      return trademarks;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
