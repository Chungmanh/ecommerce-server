const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenueController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/get-data", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const { from, to } = req.body;
  const data = await revenueController.getDataRevenue(user._id, from, to);
  return res.json(data);
});

module.exports = router;
