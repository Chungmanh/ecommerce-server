const reviewModel = require("../models/review.model");
const productModel = require("../models/product.model");

exports.addReview = async (review, userId) => {
  try {
    // console.log("review: ", review);
    const { productId, vote, comment } = review;
    const obj = {
      userId: userId,
      productId: productId,
      vote: vote,
      comment: comment,
    };
    const created = await reviewModel.create(obj);
    if (productId) {
      const votes = await productModel.updateStarByProductId(productId);
      // console.log("votes: ", votes);
    }
    return created;
  } catch (error) {
    console.log(error);
  }
};

exports.getAllReviews = async () => {
  try {
    const reviews = await reviewModel.find(
      {},
      { productId: 1, userId: 1, vote: 1 },
      { lean: true }
    );
    return reviews;
  } catch (error) {
    console.log(error);
  }
};
