const ApiError = require("../utils/apiError");
const { ROLE_HIERARCHY } = require("../config/roles");

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized("Not authorized"));
      }
      const userRole = req.user.role;
      if (userRole === "super_admin" || roles.includes(userRole)) {
        return next();
      }
      const roleService = require("../modules/role/role.service");
      const roleObj = await roleService.getRoleBySlug(userRole);
      if (roleObj && roleObj.isActive && roleObj.allowedPages && roleObj.allowedPages.length > 0) {
        return next();
      }
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    } catch (err) {
      next(err);
    }
  };
};

const authorizeMinRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Not authorized"));
    }
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const minLevel = ROLE_HIERARCHY[minRole] || 0;
    if (userLevel < minLevel) {
      return next(ApiError.forbidden("You do not have sufficient permissions"));
    }
    next();
  };
};

module.exports = { authorize, authorizeMinRole };
