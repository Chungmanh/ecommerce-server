const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");

exports.getDataRevenue = async (userId, from = "", to = "") => {
  try {
    const user = await userModel.findById(userId);
    const shopId = await user.getShopIdFromUser();

    const query = {
      shopId: shopId,
      status: "Hoàn thành",
      createdAt: {
        $lt: Date.now(),
      },
    };
    if (from) {
      query.createdAt.$gte = from;
    }
    if (to) {
      query["createdAt"].$lt = to;
    }
    const orders = await orderModel.find(query, {}, { lean: true }).populate({
      path: "items",
      populate: {
        path: "productId",
        select: "name",
        options: {
          lean: true,
        },
      },
      options: {
        lean: true,
      },
    });

    const data = [];
    const unduplicated = [];
    let totalProducts = 0;
    let totalPrice = 0;
    let list_items = [];
    for (let i = 0; i < orders.length; i++) {
      const items = orders[i].items;
      list_items = [...list_items, ...items];
    }

    for (let i = 0; i < list_items.length; i++) {
      if (!unduplicated.includes(list_items[i].productId._id)) {
        unduplicated.push(list_items[i].productId._id);
      }
    }

    for (let i = 0; i < unduplicated.length; i++) {
      let name = "";
      const amount = list_items.reduce((accumulator, currentValue) => {
        if (unduplicated[i] === currentValue.productId._id) {
          if (!name) {
            name = currentValue.productId.name;
          }
          return accumulator + currentValue.quantity;
        }
        return accumulator;
      }, 0);

      totalPrice = list_items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.quantity * currentValue.price;
      }, 0);

      data.push({
        name,
        amount,
      });
      totalProducts += amount;
    }

    return {
      data,
      totalPrice,
      totalProducts,
      totalOrders: orders.length,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
