const express = require("express");
const router = express.Router();
const trademarkController = require("../controllers/trademarkController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/add", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const { _id, name } = req.body;
  console.log("name: ", _id);
  const trademark = await trademarkController.createTrademark(
    _id,
    name,
    user._id
  );
  console.log("trademark: ", trademark);
  return res.json(trademark);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const trademark = await trademarkController.getTrademarkById(id);
  return res.json(trademark);
});

router.get(
  "/get-trademark/user",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const trademarks = await trademarkController.getTrademarkByUserId(user._id);
    return res.json(trademarks);
  }
);

router.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const deleted = await trademarkController.deleteTrademark(id, user._id);
    return res.json(deleted);
  }
);

router.get("/get-by-shopId/:id", async (req, res) => {
  const { id } = req.params;
  const trademarks = await trademarkController.getTrademarkByShopId(id);
  console.log("trademarks: ", trademarks);
  return res.json(trademarks);
});

module.exports = router;
