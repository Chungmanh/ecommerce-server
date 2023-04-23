const express = require("express");
const router = express.Router();
const recommenderSystem = require("../recommenderSystem/recommender");
const middlewareController = require("../middleware/auth.middleware");
const reviewController = require("../controllers/reviewController");

router.get("/recommend", middlewareController.verifyToken, async (req, res) => {
  const data = await reviewController.getAllReviews();
  const user = req.user;
  // console.log("user: ", user._id);
  // console.log("data: ", data);
  const listProductId = await recommenderSystem.result(data, user._id, 2);
  console.log("listProductId: ", listProductId);
  // const listProducts = await productController.getProductByArrayId(
  //   listProductId
  // );
  res.json("listProductId");
});

module.exports = router;
