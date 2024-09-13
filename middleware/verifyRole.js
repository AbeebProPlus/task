const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(403);
    const rolesArr = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArr.includes(role))
      .find((bool) => bool === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
