const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklistmodel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  try {
    if (!token) {
      res.status(401).send({ error: "token missing" });
    } else {
      const isTokenBlacklisted = await BlacklistModel.findOne({ token: token });
      if (isTokenBlacklisted) {
        res.status(401).send({ error: "please login again" });
      } else {
        jwt.verify(token, "masai", (err, decoded) => {
          if (err) {
            if (err.expiredAt) {
              res.status(401).send({ error: "token expired" });
            } else {
              res.status(500).send({ error: "internal server error" });
            }
          } else if (!decoded) {
            res.status(401).send({ error: "inavlid token" });
          } else if (decoded) {
            req.body.userID = decoded.userID;
            req.body.username = decoded.username;
            next();
          }
        });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
};

module.exports = { authMiddleware };
