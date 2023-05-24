const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const productController = require("../controllers/productController");
const middlewareController = require("../middleware/auth.middleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/update-avatar",
  middlewareController.verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    const file = req.file;
    const user = req.user;
    const shop = await shopController.getShopByUserId(user._id);
    const updated = await shopController.updateAvatar(shop._id, file);
    return res.json(updated);
  }
);

router.get(
  "/get-all",
  // middlewareController.verifyToken,
  async (req, res) => {
    const shops = await shopController.getAllShops();
    return res.json(shops);
  }
);

router.get("/get-shop", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const shop = await shopController.getShopByUserId(user._id);
  return res.json(shop);
});

router.post("/update", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const shop = req.body;
  const updated = await shopController.updateShopByUserId(user._id, shop);
  return res.status(200).json(updated);
});

router.get("/get-shop/:id", async (req, res) => {
  const { id } = req.params;
  const shop = await shopController.getShopById(id);
  const products = await productController.getAllProductByShop(id);
  const totalProduct = products.length;
  return res.json({ shop, products, totalProduct });
});
// router.get(
//   "/all",
//   middlewareController.verifyToken,
//   categoryController.getAllCategory
// );

module.exports = router;
