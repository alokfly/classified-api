const { model, Schema } = require("mongoose");
const expiryAdSchema = new Schema(
  {
    adId: {
      type: Schema.Types.ObjectId,
      ref: "add",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    adType: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
    },
    yearOfRegistration: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    features: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    negotitate: {
      type: String,
      default: "no",
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    adsPremium: {
      type: String,
    },
    status: {
      type: Number,
      default: 2,
    },
    date: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    adHiddenFromUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("expiryAd", expiryAdSchema);
