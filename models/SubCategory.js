const { model, Schema } = require("mongoose");
const subCategorySchema = new Schema(
  {
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    iconImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("subCategory", subCategorySchema);
