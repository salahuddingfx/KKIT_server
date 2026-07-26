const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const invoiceService = require("./invoice.service");

const getAllInvoices = catchAsync(async (req, res) => {
  const options = { page: req.query.page, limit: req.query.limit };
  const query = { ...req.query };

  // Non-admin users can only see their own invoices
  if (!["super_admin", "admin", "finance"].includes(req.user.role)) {
    query.user = req.user._id;
  }

  const result = await invoiceService.getAllInvoices(query, options);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  ApiResponse.success(res, invoice);
});

const downloadPDF = catchAsync(async (req, res) => {
  const { pdfBuffer, invoiceNumber } = await invoiceService.generatePDF(req.params.id);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${invoiceNumber}.pdf`,
  });
  res.send(pdfBuffer);
});

const createInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body);
  ApiResponse.created(res, invoice);
});

module.exports = { getAllInvoices, getInvoiceById, downloadPDF, createInvoice };
