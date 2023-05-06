const express = require("express");
const router = express.Router();
const trademarkController = require("../controllers/trademarkController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/add", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const { name } = req.body;
  console.log("name: ", name);
  const trademark = await trademarkController.createTrademark(name, user._id);
  console.log("trademark: ", trademark);
  return res.json(trademark);
});

router.get(
  "/get-trademark-by-user",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const trademarks = await trademarkController.getTrademarkByUserId(user._id);
    return res.json(trademarks);
  }
);

module.exports = router;
