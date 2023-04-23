const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
