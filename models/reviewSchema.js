import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// User can give only one review for a product.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

//create static
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null, // null as we don't need a id for this group
        averageRating: { $avg: '$rating' },
        numerOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numerOfReviews: result[0]?.numerOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('deleteOne', async function () {
  await this.constructor.calculateAverageRating(this.product);
});
export const Review = mongoose.model("Review", reviewSchema);
