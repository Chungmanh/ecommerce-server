const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const productController = require("../controllers/productController");
const middlewareController = require("../middleware/auth.middleware");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
const multer = require("multer");

// const storage = multer.memoryStorage();
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
  "/add",
  middlewareController.verifyToken,
  upload.single("avatar"),
  productController.addProduct
);

router.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  async (req, res) => {
    const { id } = req.params;
    const deleted = await productController.deleteProduct(id);
    res.json(deleted);
  }
);

router.post(
  "/get-product-by-shop",
  middlewareController.verifyToken,
  async (req, res) => {
    const { keyword } = req.body;
    const user = req.user;
    const user_info = await userModel.findById(user._id);
    const shopId = await shopModel.findOne({ userId: user._id });
    if (!shopId) {
      const rand_name = uuidv4();
      const shop = new shopModel({
        name: rand_name,
        userId: user_info._id,
        address: user_info?.address || "",
        telephone: user_info.telephone,
      });
      await shop.save();
      return res.status(200).json([]);
    } else {
      const products = await productController.getAllProductByShop(
        shopId,
        keyword
      );
      return res.json(products);
    }
  }
);

router.get("/get-all-product", async (req, res) => {
  const products = await productController.getAllProduct();
  res.json(products);
});

router.post("/get-products-query", async (req, res) => {
  const { query } = req.body;
  const products = await productController.getProductsByQuery(query);
  return res.json(products);
});

router.post(
  "/get-products-query-v2",
  middlewareController.verifyTokenAndIsAdmin,
  async (req, res) => {
    const { query } = req.body;
    const products = await productController.getProductsByQueryV2(query);
    return res.json(products);
  }
);

// router.get(
//   "/get-all-product",
//   middlewareController.verifyToken,
//   async (req, res) => {
//     const user = req.user;
//     const products = await productController.getProductsInHome(user._id);
//     res.json(products);
//   }
// );

router.post(
  "/get-product-ids",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const listId = req.body;
    const products = await productController.getProductByIds(user._id, listId);
    res.json(products);
  }
);

router.post(
  "/get-product-in-order",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const orderId = req.body;
    const products = await productController.getProductsByOrderId(
      orderId,
      user._id
    );
    res.json(products);
  }
);

router.get(
  "/get-all-products-order-of-user",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const cleanOrders = await productController.getAllProductsOrderOfUser(
      user._id
    );
    res.json(cleanOrders);
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productController.getProductById(id);
  res.json(product);
});

router.put(
  "/change-status",
  middlewareController.verifyTokenAndIsAdmin,
  async (req, res) => {
    const { productId, status } = req.body;
    if (productId && status) {
      const updated = await productController.changeStatus(productId, status);
      return res.status(200).json(updated);
    }
    return res.status(403).json(false);
  }
);

router.get("/get-products-shop/:id", async (req, res) => {
  const { id } = req.params;
  const products = await productController.getAllProductByShop(id);
  return res.json(products);
});

router.post("/get-products-keyword", async (req, res) => {
  const { keyword } = req.body;
  const products = await productController.getProductsByTextSearch(keyword);
  return res.json(products);
});

module.exports = router;
