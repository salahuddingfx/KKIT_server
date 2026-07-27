const ServiceOrder = require("./service-order.model");
const Payment = require("../payment/payment.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { generateInvoiceNumber } = require("../../utils/helpers");

const createOrder = async (userId, data) => {
  const count = await ServiceOrder.countDocuments();
  const orderNumber = "SO-" + String(count + 1).padStart(5, "0");

  const order = await ServiceOrder.create({
    orderNumber,
    user: userId,
    service: data.serviceId || null,
    serviceName: data.serviceName || "Digital Service",
    tier: data.tier || "basic",
    customAddons: data.customAddons || [],
    brief: data.brief,
    attachments: data.attachments || [],
    totalAmount: data.totalAmount,
    depositAmount: data.depositAmount || data.totalAmount,
    paymentMethod: data.paymentMethod || "bkash",
    transactionId: data.transactionId || "",
    paymentStatus: "pending",
    projectStatus: "pending_review",
    deliveryDeadline: data.deliveryDeadline ? new Date(data.deliveryDeadline) : undefined,
  });

  return order;
};

const getMyOrders = async (userId, options) => {
  return paginate(ServiceOrder, { user: userId }, { ...options, sort: { createdAt: -1 } });
};

const getAllOrders = async (query, options) => {
  const filter = {};
  if (query.projectStatus) filter.projectStatus = query.projectStatus;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.search) {
    filter.$or = [
      { orderNumber: { $regex: query.search, $options: "i" } },
      { serviceName: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(ServiceOrder, filter, { ...options, sort: { createdAt: -1 }, populate: "user" });
};

const getOrderById = async (id) => {
  const order = await ServiceOrder.findById(id).populate("user", "name email avatar");
  if (!order) throw ApiError.notFound("Service order not found");
  return order;
};

const updateOrderStatus = async (id, data) => {
  const order = await ServiceOrder.findById(id);
  if (!order) throw ApiError.notFound("Service order not found");

  if (data.projectStatus) order.projectStatus = data.projectStatus;
  if (data.paymentStatus) order.paymentStatus = data.paymentStatus;
  if (data.adminNotes) order.adminNotes = data.adminNotes;
  if (data.deliveryDeadline) order.deliveryDeadline = new Date(data.deliveryDeadline);

  if (data.deliverable) {
    order.deliverables.push({
      title: data.deliverable.title,
      fileUrl: data.deliverable.fileUrl,
      notes: data.deliverable.notes || "",
      deliveredAt: new Date(),
    });
    order.projectStatus = "delivered";
  }

  await order.save();

  // Send SMS update to customer if phone number exists
  try {
    const populatedOrder = await ServiceOrder.findById(id).populate("user", "name email phone");
    if (populatedOrder && populatedOrder.user && populatedOrder.user.phone) {
      const { sendOrderSMS } = require("../../services/sms/sms.service");
      sendOrderSMS({
        to: populatedOrder.user.phone,
        orderNumber: order.orderNumber,
        status: data.projectStatus || data.paymentStatus || order.projectStatus,
        totalAmount: order.totalAmount,
      }).catch(() => {});
    }
  } catch (e) {
    // Non-blocking
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
