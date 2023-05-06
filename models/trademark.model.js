const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trademarkSchema = new Schema(
  {
    name: { type: String, required: true },
    shopId: { type: Schema.Types.ObjectId, required: true, ref: "shop" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("trademark", trademarkSchema);
