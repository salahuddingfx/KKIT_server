const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const serviceOrderService = require("./service-order.service");

const createOrder = catchAsync(async (req, res) => {
  const order = await serviceOrderService.createOrder(req.user._id, req.body);
  ApiResponse.success(res, order, "Service order created successfully");
});

const getMyOrders = catchAsync(async (req, res) => {
  const result = await serviceOrderService.getMyOrders(req.user._id, {
    page: req.query.page,
    limit: req.query.limit,
  });
  ApiResponse.paginated(res, result.data, result.meta);
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await serviceOrderService.getAllOrders(req.query, {
    page: req.query.page,
    limit: req.query.limit,
  });
  ApiResponse.paginated(res, result.data, result.meta);
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await serviceOrderService.getOrderById(req.params.id);
  ApiResponse.success(res, order);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await serviceOrderService.updateOrderStatus(req.params.id, req.body);
  ApiResponse.success(res, order, "Order updated successfully");
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
