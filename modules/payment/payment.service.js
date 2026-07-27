const Payment = require("./payment.model");
const Invoice = require("../invoice/invoice.model");
const Enrollment = require("../enrollment/enrollment.model");
const Course = require("../course/course.model");
const User = require("../user/user.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { generateInvoiceNumber } = require("../../utils/helpers");
const { PAYMENT_STATUS } = require("../../utils/constants");
const { emitEvent } = require("../gamification/gamification.service");
const { generateInvoicePDF } = require("../../services/pdf/invoice.pdf");
const { sendEmail } = require("../../services/email/email.service");

const getAllPayments = async (query, options) => {
  const filter = {};
  if (query.user) filter.user = query.user;
  if (query.status) filter.status = query.status;
  if (query.method) filter.method = query.method;
  return paginate(Payment, filter, { ...options, populate: "user course invoice" });
};

const getPaymentById = async (id) => {
  const payment = await Payment.findById(id)
    .populate("user", "name email")
    .populate("course", "title thumbnail price")
    .populate("invoice");
  if (!payment) throw ApiError.notFound("Payment not found");
  return payment;
};

/**
 * Create a payment — ALWAYS starts as pending.
 * Only admin can create a completed payment directly.
 */
const createPayment = async (data, isAdmin = false) => {
  // Non-admin users can NEVER set status to completed
  if (!isAdmin) {
    data.status = PAYMENT_STATUS.PENDING;
  }

  // For manual/bank/nagad payments — keep pending until admin confirms
  if (["bkash", "nagad", "bank_transfer", "manual"].includes(data.method)) {
    data.status = PAYMENT_STATUS.PENDING;
  }

  const payment = await Payment.create(data);

  // Only auto-create invoice + enrollment if admin-marked completed
  if (isAdmin && payment.status === PAYMENT_STATUS.COMPLETED) {
    await finalizePayment(payment);
  }

  return payment;
};

/**
 * Admin confirms a payment → creates invoice + enrollment
 */
const confirmPayment = async (paymentId, adminId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw ApiError.notFound("Payment not found");
  if (payment.status === PAYMENT_STATUS.COMPLETED) {
    throw ApiError.badRequest("Payment already confirmed");
  }

  payment.status = PAYMENT_STATUS.COMPLETED;
  payment.paidAt = new Date();
  payment.meta = { ...payment.meta, confirmedBy: adminId };
  await payment.save();

  await finalizePayment(payment);

  return payment;
};

/**
 * Admin rejects/cancels a payment
 */
const cancelPayment = async (paymentId, reason) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw ApiError.notFound("Payment not found");

  payment.status = PAYMENT_STATUS.CANCELLED;
  payment.meta = { ...payment.meta, cancelReason: reason };
  await payment.save();

  return payment;
};

/**
 * Process refund
 */
const refundPayment = async (paymentId, refundAmount) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw ApiError.notFound("Payment not found");
  if (payment.status !== PAYMENT_STATUS.COMPLETED) {
    throw ApiError.badRequest("Only completed payments can be refunded");
  }

  payment.status = PAYMENT_STATUS.REFUNDED;
  payment.refundedAt = new Date();
  payment.refundAmount = refundAmount || payment.amount;
  await payment.save();

  // Cancel enrollment
  await Enrollment.findOneAndUpdate(
    { payment: payment._id },
    { status: "cancelled" }
  );

  // Update invoice
  if (payment.invoice) {
    await Invoice.findByIdAndUpdate(payment.invoice, { status: "refunded" });
  }

  return payment;
};

/**
 * Internal: create invoice + enrollment after payment confirmed
 */
const finalizePayment = async (payment) => {
  // Auto-generate invoice
  const invoiceCount = await Invoice.countDocuments();
  const invoice = await Invoice.create({
    invoiceNumber: generateInvoiceNumber(invoiceCount + 1),
    user: payment.user,
    course: payment.course,
    payment: payment._id,
    amount: payment.amount,
    tax: 0,
    total: payment.amount,
    status: "paid",
    paymentMethod: payment.method,
    billingDetails: payment.billingDetails,
    items: [{ description: "Course Enrollment", amount: payment.amount }],
    paidAt: new Date(),
  });

  payment.invoice = invoice._id;
  await payment.save();

  // Auto-enroll if not already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: payment.user,
    course: payment.course,
  });

  if (!existingEnrollment) {
    await Enrollment.create({
      user: payment.user,
      course: payment.course,
      payment: payment._id,
      status: "active",
    });
    emitEvent("course_enroll", { userId: payment.user.toString(), courseId: payment.course.toString() });
  }

  // Increment enrolledStudents on course
  await Course.findByIdAndUpdate(payment.course, { $inc: { enrolledStudents: 1 } });

  // Send Email Confirmation with Attached Invoice PDF
  try {
    const userObj =
      typeof payment.user === "object" && payment.user?.email
        ? payment.user
        : await User.findById(payment.user);
    const courseObj =
      typeof payment.course === "object" && payment.course?.title
        ? payment.course
        : await Course.findById(payment.course);

    if (userObj && userObj.email) {
      const pdfBuffer = await generateInvoicePDF(invoice, [
        {
          description: courseObj ? courseObj.title : "Course Enrollment",
          amount: payment.amount,
        },
      ]);

      await sendEmail({
        to: userObj.email,
        subject: `Payment Confirmation & Invoice - ${courseObj ? courseObj.title : "KKIT Course"}`,
        template: "paymentSuccess",
        data: {
          name: userObj.name || "Student",
          amount: payment.amount,
          courseName: courseObj ? courseObj.title : "Course Enrollment",
          transactionId: payment.transactionId || invoice.invoiceNumber,
          date: new Date().toLocaleDateString("en-BD"),
        },
        attachments: [
          {
            filename: `Invoice-${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      // Send SMS Confirmation if user phone or billing phone exists
      const targetPhone = userObj.phone || payment.billingDetails?.phone;
      if (targetPhone) {
        const { sendEnrollmentSMS } = require("../../services/sms/sms.service");
        sendEnrollmentSMS({
          to: targetPhone,
          courseTitle: courseObj ? courseObj.title : "Course",
          studentName: userObj.name,
        }).catch((smsErr) => console.error("Failed to send enrollment SMS:", smsErr));
      }
    }
  } catch (emailErr) {
    console.error("Failed to send payment confirmation email:", emailErr);
  }
};

const handleWebhook = async (provider, payload) => {
  // Placeholder for webhook handling
  return { processed: true };
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  confirmPayment,
  cancelPayment,
  refundPayment,
  handleWebhook,
};
