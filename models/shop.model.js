const productModel = require("./product.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    name: { type: String, required: true, unique: true },
    address: { type: String },
    telephone: { type: String, required: true, default: "" },
    avatar: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

shopSchema.method(
  "getTotalProductOfShop",
  async function getTotalProductOfShop() {
    try {
      const total = await productModel
        .find({ shopId: this._id }, { _id: 1 }, { lean: true })
        .count();
      return total;
    } catch (error) {
      return 0;
    }
  }
);

module.exports = mongoose.model("shop", shopSchema);
