const { model, Schema } = require("mongoose");
const addSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    features: {
      type: String,
      required: true,
    },
    adsType: {
      type: String,
      required: true,
    },
    adsPremium: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("add", addSchema);
