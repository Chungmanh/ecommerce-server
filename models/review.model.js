// const productModel = require("./product.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "product" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    vote: { type: Number, default: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.static(
  "checkHasReviewed",
  async function checkHasReviewed(productId, userId) {
    const review = await this.findOne(
      { userId, productId },
      { _id: 1 },
      { lean: true }
    );
    if (review) {
      return true;
    }
    return false;
  }
);
module.exports = mongoose.model("review", reviewSchema);
