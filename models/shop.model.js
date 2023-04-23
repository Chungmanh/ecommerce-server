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

module.exports = mongoose.model("shop", shopSchema);
