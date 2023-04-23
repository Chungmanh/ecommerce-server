const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");
const shopModel = require("../models/shop.model");
const orderModel = require("../models/order.model");
const reviewModel = require("../models/review.model");
// const { v4: uuidv4 } = require("uuid");
const { uploadFile } = require("../services/firebase");

exports.addProduct = async (req, res) => {
  try {
    const user = req.user;
    const shop = await shopModel.findOne({ userId: user._id });
    //Create new product
    const product = req.body;
    const file = req.file;
    // console.log("product: ", product);
    // console.log("file: ", file);

    const { _id, ...other } = product;
    if (_id) {
      const url_file = await uploadFile(file, "product");
      const updated = await productModel.findByIdAndUpdate(_id, {
        ...product,
        avatar: url_file,
      });
      return res.status(200).json("updated");
    }
    const url_file = await uploadFile(file, "product");
    const created = new productModel({
      ...other,
      avatar: url_file,
      shopId: shop._id,
    });

    created.save();

    // const created = await productModel.create(product);
    return res.status(200).json("created");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.deleteProduct = async (id) => {
  try {
    const deleted = await productModel.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getAllProductByShop = async (shopId) => {
  try {
    const products = await productModel.find({ shopId: shopId });
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getAllProduct = async () => {
  try {
    const products = await productModel.find({});
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getProductByIds = async (userId, ids) => {
  try {
    const products = await productModel.find({ _id: { $in: ids } }).lean();
    const cart = await cartModel.findOne({ userId });
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += await cart.getTotalPriceFromProductIdInCart(
        products[i]._id.toString()
      );
      const quantity = cart.items.find(
        (item) => item.productId.toString() === products[i]._id.toString()
      ).quantity;
      if (quantity) {
        products[i].quantity = quantity;
      }
    }

    return { products, total };
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getProductById = async (id) => {
  try {
    const product = await productModel.findById(id, {}, { lean: true });
    const reviews = await reviewModel.find(
      { productId: id },
      {},
      { populate: { path: "userId", options: { lean: true } }, lean: true }
    );
    return { ...product, reviews };
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getProductsByOrderId = async (orderId, userId) => {
  try {
    const { items } = await orderModel.findOne(
      { _id: orderId, userId: userId },
      { items: 1 },
      { lean: true }
    );
    const ids = items.map((item) => item.productId.toString());
    const products = await productModel.find(
      { _id: { $in: ids } },
      {},
      { lean: true }
    );
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getAllProductsOrderOfUser = async (userId) => {
  try {
    const list_items = await orderModel
      .find(
        { userId: userId },
        { items: 1, status: 1, shopId: 1 },
        { lean: true }
      )
      .populate({
        path: "shopId",
        select: "name",
        options: { lean: true },
      })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          select: "name avatar",
          options: {
            lean: true,
          },
        },
        options: {
          lean: true,
        },
      });
    // status: 'Đang giao'

    const waitForConfirmation = [];
    const delivery = [];
    const completed = [];
    const cancelled = [];
    for (let i = 0; i < list_items.length; i++) {
      const order = {
        _id: list_items[i]._id,
        shop_name: list_items[i].shopId.name,
        items: list_items[i].items,
        status: list_items[i].status,
      };
      if (list_items[i].status === "Chờ xác nhận") {
        waitForConfirmation.push(order);
      }
      if (list_items[i].status === "Đang giao") {
        delivery.push(order);
      }
      if (list_items[i].status === "Hoàn thành") {
        const items = list_items[i].items;
        for (let j = 0; j < items.length; j++) {
          const productId = items[j].productId._id;
          const hasReviewed = await reviewModel.checkHasReviewed(
            productId,
            userId
          );
          items[j].hasReviewed = hasReviewed;
        }
        completed.push(order);
      }
      if (list_items[i].status === "Hủy đơn") {
        cancelled.push(order);
      }
    }

    return { waitForConfirmation, delivery, completed, cancelled };
  } catch (error) {
    console.log(error);
    return {};
  }
};
