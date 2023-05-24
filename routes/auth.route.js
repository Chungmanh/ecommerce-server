const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const middlewareController = require("../middleware/auth.middleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refreshToken", authController.requesRefreshToken);
// router.get("/refreshToken", (req, res) => {
//   res.status(200).json("hello");
// });
// router.get("/refreshToken", () => {
//   console.log("popopo");
// });
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.logoutUser
);

module.exports = router;
