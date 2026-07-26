const Invoice = require("./invoice.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { generateInvoiceNumber } = require("../../utils/helpers");
const { generateInvoicePDF } = require("../../services/pdf/invoice.pdf");
const { sendEmail } = require("../../services/email/email.service");

const getAllInvoices = async (query, options) => {
  const filter = {};
  if (query.user) filter.user = query.user;
  if (query.status) filter.status = query.status;
  return paginate(Invoice, filter, { ...options, populate: "user course" });
};

const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id)
    .populate("user", "name email phone")
    .populate("course", "title thumbnail")
    .populate("payment", "method transactionId paidAt");
  if (!invoice) throw ApiError.notFound("Invoice not found");
  return invoice;
};

const generatePDF = async (id) => {
  const invoice = await Invoice.findById(id)
    .populate("user", "name email phone address")
    .populate("payment", "method transactionId paidAt");

  if (!invoice) throw ApiError.notFound("Invoice not found");

  const pdfBuffer = await generateInvoicePDF(invoice, invoice.items);

  // Send email with PDF (fire and forget)
  sendEmail({
    to: invoice.user.email,
    subject: `Invoice ${invoice.invoiceNumber}`,
    template: "invoice",
    data: {
      name: invoice.user.name,
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total.toFixed(2),
      status: invoice.status,
    },
    attachments: [
      {
        filename: `${invoice.invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  }).catch(() => {});

  return { pdfBuffer, invoiceNumber: invoice.invoiceNumber };
};

const createInvoice = async (data) => {
  const count = await Invoice.countDocuments();
  data.invoiceNumber = generateInvoiceNumber(count + 1);
  return Invoice.create(data);
};

module.exports = { getAllInvoices, getInvoiceById, generatePDF, createInvoice };
