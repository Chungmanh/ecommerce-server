const shopModel = require("./shop.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    admin: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// userSchema.static(
//   "getShopIdFromUserId",
//   async function getShopIdFromUserId(userId) {
//     const { price } = await this.findById(
//       productId,
//       { price: 1 },
//       { lean: true }
//     );
//     return price;
//   }
// );

userSchema.method("getShopIdFromUser", async function getShopIdFromUser() {
  const shop = await shopModel.findOne({ userId: this._id }, { _id: 1 }).lean();

  if (shop) {
    const { _id } = shop;
    return _id;
  }
  return null;
});

module.exports = mongoose.model("user", userSchema);
