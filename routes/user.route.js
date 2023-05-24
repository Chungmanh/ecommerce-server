const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
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
    const updated = await userController.updateAvatar(user._id, file);
    return res.json(updated);
  }
);

router.get(
  "/get-all",
  // middlewareController.verifyToken,
  async (req, res) => {
    const users = await userController.getAllUsers();
    return res.json(users);
  }
);

router.get("/get-info", middlewareController.verifyToken, async (req, res) => {
  const user = req.user;
  const userInfo = await userController.getUserById(user._id);
  return res.json(userInfo);
});

router.put(
  "/change-info",
  middlewareController.verifyToken,
  async (req, res) => {
    const user = req.user;
    const { username, address, telephone } = req.body;
    if (username && address && telephone) {
      const updated = await userController.updateUserById(
        user._id,
        username,
        address,
        telephone
      );
      return res.status(200).json(updated);
    }
    return res.status(403).json(false);
  }
);

module.exports = router;
