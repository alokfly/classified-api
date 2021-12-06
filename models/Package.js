const { model, Schema } = require("mongoose");
const packageSchema = new Schema(
  {
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("package", packageSchema);
