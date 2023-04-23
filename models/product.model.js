const shopModel = require("./shop.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "shop",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "category",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    avatar: { type: String, default: "" },
    type: { type: String, default: "Khác" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// productSchema.method('get', function fullName(): string {
//   return this.firstName + ' ' + this.lastName;
// });

productSchema.static(
  "getShopFromProductId",
  async function getShopFromProductId(productId) {
    console.log("productId: ", productId);
    const test = await this.findById(productId, { shopId: 1 }, { lean: true });
    console.log("test: ", test);
    const { shopId } = await this.findById(
      productId,
      { shopId: 1 },
      { lean: true }
    );
    const shop = await shopModel.findById(shopId).lean();

    // console.log("shop: ", shop);
    return shop;
  }
);

productSchema.static(
  "getPriceFromProductId",
  async function getPriceFromProductId(productId) {
    const { price } = await this.findById(
      productId,
      { price: 1 },
      { lean: true }
    );
    return price;
  }
);

module.exports = mongoose.model("product", productSchema);
