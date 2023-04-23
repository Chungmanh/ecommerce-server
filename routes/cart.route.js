const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/add", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const { productId, quantity } = req.body;
  const totalItem = await cartController.addToCart(
    user._id,
    productId,
    quantity
  );
  res.status(200).json(totalItem);
});

router.get("/get-cart", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const cart = await cartController.getCart(user._id);
  res.status(200).json(cart);
});

router.get(
  "/get-cart-drawer",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const cart = await cartController.getCartDrawer(user._id);
    res.status(200).json(cart);
  }
);

router.put("/update", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  console.log("req.body: ", req.body);
  const { productId, quantity, type } = req.body;
  const updated = await cartController.updateToCart(
    user._id,
    productId,
    quantity,
    type
  );
  res.status(200).json(updated);
});

router.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const deleted = await cartController.removeItem(user._id, id);
    res.status(200).json(deleted);
  }
);

// router.get(
//   "/all",
//   middlewareController.verifyToken, async(req, res)=>{
//     const item
//     cartController.addToCart()

//   }
// );

module.exports = router;
