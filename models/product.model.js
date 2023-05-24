const shopModel = require("./shop.model");
const reviewModel = require("./review.model");
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
      required: true,
      ref: "category",
    },
    trademarkId: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "trademark",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    avatar: { type: String, default: "" },
    note: { type: String, default: "" },
    type: { type: String, default: "Khác" },
    // status: { type: Boolean, default: true },
    status: { type: Number, default: 1 }, // 1. Chưa duyệt, 2. Đã duyệt, 3. Đã loại
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  description: "text",
});

// productSchema.method('get', function fullName(): string {
//   return this.firstName + ' ' + this.lastName;
// });

productSchema.static(
  "getShopFromProductId",
  async function getShopFromProductId(productId) {
    const { shopId } = await this.findById(
      productId,
      { shopId: 1 },
      { lean: true }
    );
    console.log("shopId: ", shopId);
    const shop = await shopModel.findById(shopId);

    console.log("shop: ", shop);
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

productSchema.static(
  "updateStarByProductId",
  async function updateStarByProductId(productId) {
    const list_vote = (
      await reviewModel.find(
        { productId: productId },
        { vote: 1, _id: 0 },
        { lean: true }
      )
    ).map((vote) => vote.vote);
    const avg_vote = list_vote.reduce((a, b) => a + b, 0) / list_vote.length;
    return this.findByIdAndUpdate(productId, { star: avg_vote }, { new: true });
  }
);

module.exports = mongoose.model("product", productSchema);
