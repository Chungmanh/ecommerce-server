const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/add", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const { order } = req.body;
  if (!order) {
    return res.status(200).json("error");
  }
  const isSuccess = await orderController.createOrder(user._id, order);
  return res.status(200).json(isSuccess);
});

router.get(
  "/get-orders-by-user",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const orders = await orderController.getOrderByUser(user._id);
    return res.status(200).json(orders);
  }
);

router.get(
  "/get-items-order/:id",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const items = await orderController.getItemsInOrder(user._id, id);
    return res.status(200).json(items);
  }
);

router.put(
  "/change-status",
  middlewareController.verifyToken,
  async (req, res) => {
    const { orderId, status } = req.body;
    const status_value = await orderController.handleChangeStatus(
      orderId,
      status
    );
    return res.status(200).json(status_value);
  }
);

router.put(
  "/cancel-order",
  middlewareController.verifyToken,
  async (req, res) => {
    const { orderId } = req.body;
    const canceled = await orderController.handleCancelOrder(orderId);
    return res.status(200).json(canceled);
  }
);

router.put(
  "/repurchase",
  middlewareController.verifyToken,
  async (req, res) => {
    const { orderId } = req.body;
    const repurchase = await orderController.handleRepurchase(orderId);
    return res.status(200).json(repurchase);
  }
);

module.exports = router;
