const Installment = require("./installment.model");
const ApiError = require("../../utils/apiError");

const createInstallmentPlan = async (userId, { courseId, totalAmount, numberOfInstallments }) => {
  const installmentAmount = Math.ceil(totalAmount / numberOfInstallments);
  const installments = [];
  const startDate = new Date();

  for (let i = 0; i < numberOfInstallments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    installments.push({
      number: i + 1,
      amount: installmentAmount,
      dueDate,
      status: "pending",
    });
  }

  return Installment.create({
    user: userId,
    course: courseId,
    totalAmount,
    numberOfInstallments,
    installmentAmount,
    installments,
    status: "active",
    startDate,
  });
};

const payInstallment = async (installmentId, installmentNumber, { transactionId }) => {
  const installment = await Installment.findById(installmentId);
  if (!installment) throw ApiError.notFound("Installment plan not found");
  if (installment.status !== "active") throw ApiError.badRequest("Installment plan is not active");

  const installmentEntry = installment.installments.find(
    (i) => i.number === installmentNumber
  );

  if (!installmentEntry) throw ApiError.notFound("Installment not found");
  if (installmentEntry.status === "paid") throw ApiError.badRequest("Installment already paid");

  installmentEntry.status = "paid";
  installmentEntry.paidAt = new Date();
  installmentEntry.transactionId = transactionId;

  const allPaid = installment.installments.every((i) => i.status === "paid");
  if (allPaid) {
    installment.status = "completed";
  }

  await installment.save();
  return installment;
};

const getUserInstallments = async (userId) => {
  return Installment.find({ user: userId })
    .populate("course", "title thumbnail")
    .sort({ createdAt: -1 });
};

const getInstallmentById = async (id, userId) => {
  const installment = await Installment.findOne({ _id: id, user: userId })
    .populate("course", "title thumbnail");
  if (!installment) throw ApiError.notFound("Installment plan not found");
  return installment;
};

module.exports = {
  createInstallmentPlan,
  payInstallment,
  getUserInstallments,
  getInstallmentById,
};
