const shopModel = require("./shop.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    telephone: { type: String, required: true, uinque: true },
    password: { type: String, required: true },
    avatar: { type: String },
    admin: { type: Boolean, default: false },
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
  const { _id } = await shopModel
    .findOne({ userId: this._id }, { _id: 1 })
    .lean();
  return _id;
});

module.exports = mongoose.model("user", userSchema);
