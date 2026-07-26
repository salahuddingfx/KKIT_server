const User = require("./user.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllUsers = async (query, options) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(User, filter, options);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

const changeUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, changeUserRole };
