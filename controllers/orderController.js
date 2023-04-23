const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");

exports.createOrder = async (userId, order) => {
  try {
    const cart = await cartModel.findOne({ userId }, {}, { lean: true });
    const user = await userModel.findById(userId, {}, { lean: true });

    for (let i = 0; i < order.length; i++) {
      const { items } = order[i];
      const shop = await productModel.getShopFromProductId(items[0]);

      const orderItems = [];
      let total = 0;
      for (let j = 0; j < items.length; j++) {
        const price = await productModel.getPriceFromProductId(items[j]);
        const orderItem = await cart.items.find(
          (item) => item.productId.toString() === items[j]
        );

        total += orderItem.quantity;
        orderItem.price = price;
        orderItems.push(orderItem);
      }
      const newOrder = new orderModel({
        userId: userId,
        shopId: shop._id,
        items: orderItems,
        address: user.address,
        telephone: user.telephone,
        total: total,
      });
      newOrder.save();
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getOrderByUser = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const shopId = await user.getShopIdFromUser();

    const orders = await orderModel
      .find({ shopId: shopId }, {}, { lean: true })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          populate: { path: "shopId", options: { lean: true } },
          options: {
            lean: true,
          },
        },
        options: {
          lean: true,
        },
      })
      .populate({
        path: "userId",
        select: "username",
        options: { lean: true },
      });

    if (orders && orders.length !== 0) {
      for (let i = 0; i < orders.length; i++) {
        const items = [...orders[i].items] || [];
        const totalPrice = await items.reduce(
          (previousValue, currentValue) =>
            previousValue + currentValue.quantity * currentValue.price,
          0
        );

        orders[i].totalPrice = totalPrice;
      }
      return orders;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getOrdersByCustomer = async (userId) => {
  try {
    console.log("userId: ", userId);
    const orders = await orderModel
      .find({ userId: userId }, {}, { lean: true })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          populate: { path: "shopId", options: { lean: true } },
          options: {
            lean: true,
          },
        },
        options: {
          lean: true,
        },
      });
    console.log("order: ", orders);
    if (orders) {
      const itemsInOrder = [];
      const items = [...orders.items] || [];

      for (let i = 0; i < items.length; i++) {
        const { productId, quantity, price } = items[i];
        const { shopId, ...product_info } = productId;
        product_info.quantity = quantity;
        product_info.price = price;
        const shop_name = shopId.name;
        const isExits = itemsInOrder.find(
          (item) => item.shop_name === shop_name
        );
        if (isExits) {
          isExits.items.push(product_info);
        } else {
          itemsInOrder.push({
            shop_name,
            items: [product_info],
          });
        }
      }
      return { itemsInOrder, total: orders.total };
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.handleChangeStatus = async (orderId, status) => {
  try {
    const order = await orderModel.findById(orderId);
    order.status = status;
    order.save();
    return status;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.handleCancelOrder = async (orderId) => {
  try {
    const order = await orderModel.findById(orderId);
    if (order && order.status === "Chờ xác nhận") {
      order.status = "Hủy đơn";
      order.save();
    }
    return order;
  } catch (error) {
    console.log(error);
  }
};

exports.handleRepurchase = async (orderId) => {
  try {
    const order = await orderModel.findById(orderId);
    if (order && order.status === "Hủy đơn") {
      order.status = "Chờ xác nhận";
      order.save();
    }
    return order;
  } catch (error) {
    console.log(error);
  }
};

exports.getItemsInOrder = async (userId, orderId) => {
  try {
    const user = await userModel.findById(userId);
    const shopId = await user.getShopIdFromUser();
    const { items } = await orderModel
      .findOne({ _id: orderId, shopId: shopId }, { items: 1 }, { lean: true })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          options: {
            lean: true,
          },
        },
        options: {
          lean: true,
        },
      });
    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
};
