const trademarkModel = require("../models/trademark.model");
const userModel = require("../models/user.model");

exports.createTrademark = async (id = "", trademarkName, userId) => {
  try {
    if (id) {
      const updated = await trademarkModel.findByIdAndUpdate(
        id,
        {
          name: trademarkName,
        },
        { new: true }
      );
      return updated;
    }

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
    console.log("heree");
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

exports.deleteTrademark = async (id, userId) => {
  try {
    const user = await userModel.findById(userId);
    const shopId = await user.getShopIdFromUser();
    const deleted = await trademarkModel.findOneAndDelete({
      _id: id,
      shopId: shopId,
    });
    return deleted;
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getTrademarkByShopId = async (shopId) => {
  try {
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

exports.getTrademarkById = async (id) => {
  try {
    const trademark = await trademarkModel.findById(id, {}, { lean: true });
    return trademark;
  } catch (error) {
    console.log(error);
    return {};
  }
};
