const ApiError = require("../utils/apiError");
const PERMISSIONS = require("../config/permissions");
const roleService = require("../modules/role/role.service");

const authorizePermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized("Not authorized"));
      }

      const userRole = req.user.role;
      let userPermissions = PERMISSIONS[userRole];

      if (!userPermissions) {
        const roleObj = await roleService.getRoleBySlug(userRole);
        userPermissions = roleObj?.permissions || [];
      }

      if (userPermissions.includes("*")) {
        return next();
      }

      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        return next(ApiError.forbidden("You do not have the required permissions"));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { authorizePermission };
