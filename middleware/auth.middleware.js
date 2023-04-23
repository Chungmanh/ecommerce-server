const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  // console.log("req.headers: ", req.headers["authorization"]);
  const token = req.headers["authorization"];
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, "JWT_ACCESS_KEY", (err, user) => {
      if (err) {
        return res.status(403).json(err);
        // return res.status(403).json("token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

exports.verifyTokenAndUserAuth = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user._id == req.params.id) {
      next();
    } else {
      res.status(403).json("You are not allowed");
    }
  });
};
