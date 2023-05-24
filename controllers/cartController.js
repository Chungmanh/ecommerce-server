const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

exports.addToCart = async (userId, productId, quantity = 1) => {
  try {
    const product = await productModel.findById(productId);

    const item_info = {
      productId: product._id,
      quantity: quantity,
      price: product.price,
    };

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      const newCart = new cartModel({
        userId: userId,
        items: [item_info],
        total: quantity,
      });
      newCart.save();
    } else {
      const isExits = cart.items.filter((item) => item.productId == productId);
      // console.log("isExitst: ", isExits);
      if (isExits && isExits.length === 0) {
        cart.items.push(item_info);
      } else {
        cart.items = cart.items.map((item) => {
          if (item.productId == productId) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
      }
      cart.total += quantity;
      cart.save();
    }
    return { total: cart.total };
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.updateToCart = async (
  userId,
  productId,
  quantity = 1,
  type = "increase"
) => {
  try {
    console.log(type, ": ", productId);
    const cart = await cartModel.findOne({ userId });
    const value = type === "increase" ? quantity : -quantity;

    const new_items = cart.items.map((item) => {
      if (item.productId == productId) {
        item.quantity += value;
      }

      return item;
    });

    cart.items = new_items;
    cart.total += value;

    cart.save();

    return cart;
  } catch (error) {
    console.log(error);

    return {};
  }
};

exports.removeItem = async (userId, productId) => {
  try {
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      const newCart = new cartModel({
        userId: userId,
        items: [],
        total: 0,
      });
      newCart.save();
    } else {
      let quantity_item_delete = 0;
      const new_items = cart.items.filter((item) => {
        if (item.productId.toString() === productId.toString()) {
          quantity_item_delete = item.quantity;
        }
        return item.productId.toString() !== productId.toString();
      });
      cart.items = [...new_items];
      cart.total -= quantity_item_delete;
      cart.save();
    }
    return cart;
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getCart = async (userId) => {
  try {
    const cart = await cartModel
      .findOne({ userId }, {}, { lean: true })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          populate: { path: "shopId", options: { lean: true } },
          // match: { deleted: false },
          options: {
            lean: true,
          },
        },
        options: {
          lean: true,
        },
      });
    if (cart) {
      const itemsInShop = [];
      const items = [...cart.items] || [];

      for (let i = 0; i < items.length; i++) {
        const { productId, quantity } = items[i];
        const { shopId, ...product_info } = productId;
        product_info.quantity = quantity;
        const shop_name = shopId.name;
        const isExits = itemsInShop.find(
          (item) => item.shop_name === shop_name
        );
        if (isExits) {
          isExits.items.push(product_info);
        } else {
          itemsInShop.push({
            shop_name,
            items: [product_info],
          });
        }
      }
      return { itemsInShop, total: cart.total };
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

exports.getCartDrawer = async (userId) => {
  try {
    const cart = await cartModel
      .findOne({ userId }, {}, { lean: true })
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
    if (cart) {
      // const itemsInShop = [];
      // const items = [...cart.items] || [];

      // for (let i = 0; i < items.length; i++) {
      //   const { productId, quantity } = items[i];
      //   const { shopId, ...product_info } = productId;
      //   product_info.quantity = quantity;
      //   const shop_name = shopId.name;
      //   const isExits = itemsInShop.find(
      //     (item) => item.shop_name === shop_name
      //   );
      //   if (isExits) {
      //     isExits.items.push(product_info);
      //   } else {
      //     itemsInShop.push({
      //       shop_name,
      //       items: [product_info],
      //     });
      //   }
      // }
      return cart;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};
