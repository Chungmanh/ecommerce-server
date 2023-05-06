const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const middlewareController = require("../middleware/auth.middleware");

router.get(
  "/get-all",
  // middlewareController.verifyToken,
  async (req, res) => {
    const users = await userController.getAllUsers();
    return res.json(users);
  }
);

module.exports = router;
