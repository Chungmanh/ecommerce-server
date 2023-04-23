const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    shopId: { type: Schema.Types.ObjectId, required: true, ref: "shop" },
    items: [orderItemSchema],
    note: { type: String, default: "" },
    address: { type: String, required: true, default: "" },
    telephone: { type: String, required: true, uinque: true },
    total: { type: Number, default: 0 },
    status: { type: String, default: "Chờ xác nhận" },
  },
  { timestamps: true }
);

// orderSchema.static('myStaticMethod', function myStaticMethod() {
//   return 42;
// });

module.exports = mongoose.model("order", orderSchema);
