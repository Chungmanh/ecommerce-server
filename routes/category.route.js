const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
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
  "/add",
  middlewareController.verifyTokenAndIsAdmin,
  upload.single("avatar"),
  categoryController.addcategory
);

router.get(
  "/all",
  // middlewareController.verifyToken,
  categoryController.getAllCategory
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const category = await categoryController.getCategoryById(id);
  res.json(category);
});

router.delete(
  "/delete/:id",
  middlewareController.verifyTokenAndIsAdmin,
  async (req, res) => {
    const { id } = req.params;
    const deleted = await categoryController.deleteCategory(id);
    res.json(deleted);
  }
);

module.exports = router;
