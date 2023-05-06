const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const middlewareController = require("../middleware/auth.middleware");

router.get(
  "/get-all",
  // middlewareController.verifyToken,
  async (req, res) => {
    const shops = await shopController.getAllShops();
    return res.json(shops);
  }
);

// router.get(
//   "/all",
//   middlewareController.verifyToken,
//   categoryController.getAllCategory
// );

module.exports = router;
