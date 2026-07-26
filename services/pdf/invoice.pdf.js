const PDFDocument = require("pdfkit");

const generateInvoicePDF = (invoice, items) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fontSize(24).font("Helvetica-Bold").text("INVOICE", { align: "right" });
    doc.fontSize(10).font("Helvetica").fillColor("#666666");
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, { align: "right" });
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString("en-BD")}`, { align: "right" });
    doc.text(`Status: ${invoice.status.toUpperCase()}`, { align: "right" });
    doc.moveDown(2);

    // Reset color
    doc.fillColor("#000000");

    // Company info (left)
    doc.fontSize(14).font("Helvetica-Bold").text("KKIT");
    doc.fontSize(9).font("Helvetica").fillColor("#666666");
    doc.text("Empowering Education");
    doc.moveDown(2);

    // Billing details
    doc.fillColor("#000000").fontSize(12).font("Helvetica-Bold").text("Bill To:");
    doc.fontSize(10).font("Helvetica");
    const billing = invoice.billingDetails || {};
    doc.text(billing.name || invoice.user?.name || "N/A");
    doc.text(billing.email || invoice.user?.email || "N/A");
    if (billing.phone) doc.text(billing.phone);
    if (billing.address) doc.text(billing.address);
    if (billing.city) doc.text(`${billing.city}${billing.country ? ", " + billing.country : ""}`);
    doc.moveDown(2);

    // Payment info
    if (invoice.payment) {
      doc.fontSize(12).font("Helvetica-Bold").text("Payment Details:");
      doc.fontSize(10).font("Helvetica");
      doc.text(`Method: ${invoice.payment.method?.toUpperCase() || "N/A"}`);
      if (invoice.payment.transactionId) doc.text(`Transaction ID: ${invoice.payment.transactionId}`);
      if (invoice.payment.paidAt) doc.text(`Paid On: ${new Date(invoice.payment.paidAt).toLocaleDateString("en-BD")}`);
      doc.moveDown(2);
    }

    // Table header
    const tableTop = doc.y;
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Description", 50, tableTop, { width: 300 });
    doc.text("Amount (BDT)", 400, tableTop, { width: 130, align: "right" });

    doc.strokeColor("#cccccc").moveTo(50, tableTop + 18).lineTo(530, tableTop + 18).stroke();
    doc.fillColor("#000000");

    // Table rows
    let y = tableTop + 28;
    doc.font("Helvetica");
    (items || []).forEach((item) => {
      doc.text(item.description || "Course Enrollment", 50, y, { width: 300 });
      doc.text(`৳${item.amount.toLocaleString("en-BD")}`, 400, y, { width: 130, align: "right" });
      y += 22;
    });

    // Divider
    doc.strokeColor("#cccccc").moveTo(50, y).lineTo(530, y).stroke();
    y += 12;

    // Totals
    doc.font("Helvetica");
    doc.text("Subtotal:", 350, y, { width: 80, align: "right" });
    doc.text(`৳${invoice.amount.toLocaleString("en-BD")}`, 440, y, { width: 90, align: "right" });
    y += 18;
    doc.text("Tax:", 350, y, { width: 80, align: "right" });
    doc.text(`৳${(invoice.tax || 0).toLocaleString("en-BD")}`, 440, y, { width: 90, align: "right" });
    y += 18;

    doc.strokeColor("#999999").moveTo(350, y).lineTo(530, y).stroke();
    y += 8;

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Total:", 350, y, { width: 80, align: "right" });
    doc.text(`৳${invoice.total.toLocaleString("en-BD")}`, 440, y, { width: 90, align: "right" });

    // Footer
    doc.fontSize(8).font("Helvetica").fillColor("#999999");
    doc.text("Thank you for your business!", 50, 750, { align: "center", width: 500 });
    doc.text("KKIT - Empowering Education | support@kkit.com", 50, 765, { align: "center", width: 500 });

    doc.end();
  });
};

module.exports = { generateInvoicePDF };
