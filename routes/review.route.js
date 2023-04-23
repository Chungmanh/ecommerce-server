const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/add", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const review = req.body;
  const created = await reviewController.addReview(review, user._id);
  res.json(created);
});

// router.get(
//   "/all",
//   middlewareController.verifyToken,
//   categoryController.getAllCategory
// );

module.exports = router;
