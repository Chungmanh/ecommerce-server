const userModel = require("../models/user.model");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const newUser = await new userModel({
      username: req.body.username,
      telephone: req.body.telephone,
      address: req.body.address,
      password: hashed,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      admin: user.admin,
    },
    "JWT_ACCESS_KEY",
    { expiresIn: "2h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      admin: user.admin,
    },
    "JWT_REFRESH_KEY",
    { expiresIn: "30d" }
  );
};

exports.loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ telephone: req.body.telephone });
    if (!user) {
      return res.status(404).json("Wrong phonenumber!");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(404).json("Wrong password!");
    }
    if (user && validPassword) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const { password, ...others } = user._doc;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: false,
        // path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ ...others, accessToken, refreshToken });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json("Logged out !");
};

exports.requesRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  // console.log("req", req.cookies);
  console.log("req", req.body);
  if (!refreshToken)
    return res
      .status(401)
      .json({ name: "Authenticated", message: "You are not authenticated" });

  jwt.verify(refreshToken, "JWT_REFRESH_KEY", async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log("user: ", user);
    }

    const isExists = await userModel.findById(user._id);
    console.log("isExists: ", isExists);
    if (!isExists) return res.status(401).json("You are not authenticated 2");

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      // secure: false,
      // path: "/",
      sameSite: "strict",
    });

    return res.status(200).json(newAccessToken);
  });
};
