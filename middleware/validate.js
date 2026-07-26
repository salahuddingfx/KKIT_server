const ApiError = require("../utils/apiError");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(ApiError.validationError(errors));
    }

    req[source] = result.data;
    next();
  };
};

module.exports = validate;
