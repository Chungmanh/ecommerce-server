const reviewModel = require("../models/review.model");

exports.addReview = async (review, userId) => {
  try {
    console.log("review: ", review);
    const obj = {
      userId: userId,
      productId: review.productId,
      vote: review.vote,
      comment: review.comment,
    };
    const created = await reviewModel.create(obj);
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
