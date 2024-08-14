import mongoose from "mongoose";


const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: {
        values: ["office", "livingroom", "bedroom", "outdoor"],
        message: "{VALUE} is not supported",
      }
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      enum: {
        values: ["Ashley", "IKEA", "Godrej", "Durian"],
        message: "{VALUE} is not supported",
      },
    },
    image: {
      type: String,
      default: "/images/example.jpeg",
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    colors: {
      type: [String],
      default: ["#000"],
      required: true,
    },
    inventoryStock: {
      type: Number,
      required: true,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numerOfReviews: {
      type: Number,
      default: 0,
    },
    isfeatured: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
