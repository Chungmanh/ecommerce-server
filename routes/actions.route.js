const express = require("express");
const router = express.Router();
const recommenderSystem = require("../recommenderSystem/recommender");
const middlewareController = require("../middleware/auth.middleware");
const reviewController = require("../controllers/reviewController");
const productController = require("../controllers/productController");

router.get("/recommend", middlewareController.verifyToken, async (req, res) => {
  const data = await reviewController.getAllReviews();
  const user = req.user;
  const listProductId = await recommenderSystem.result(data, user._id, 2);
  // console.log("listProductId: ", listProductId);
  const listProducts = await productController.getProductByIdsV2(listProductId);
  return res.json(listProducts);
});

module.exports = router;
