const productModel = require("./product.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    quantity: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// cartSchema.static(
//   "getTotalPriceFromProductIdInCart",
//   async function getTotalPriceFromProductIdInCart(productId) {
//     const { quantity } = await this.items.find(
//       (item) => item.productId === productId
//     );
//     const price = productModel.getPriceFromProductId(productId);
//     const total = price * quantity;
//     console.log("total: ", total);
//     return total;
//   }
// );
cartSchema.method(
  "getTotalPriceFromProductIdInCart",
  async function getTotalPriceFromProductIdInCart(productId) {
    const { quantity } = await this.items.find(
      (item) => item.productId.toString() === productId
    );
    const price = await productModel.getPriceFromProductId(productId);
    const total = price * quantity;
    return total;
  }
);

module.exports = mongoose.model("cart", cartSchema);
