const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const middlewareController = require("../middleware/auth.middleware");

router.post(
  "/add",
  middlewareController.verifyToken,
  categoryController.addcategory
);

router.get(
  "/all",
  middlewareController.verifyToken,
  categoryController.getAllCategory
);

module.exports = router;
