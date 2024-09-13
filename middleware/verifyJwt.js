const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  console.log("Verifying JWT......");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.email = decoded.userInfo.email;
    req.roles = decoded.userInfo.roles;
    next();
  });
};

module.exports = verifyJwt;
