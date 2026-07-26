const PDFDocument = require("pdfkit");

const generateInvoicePDF = (invoice, items) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Top Header Bar / Accent Line
    doc.rect(0, 0, 595, 12).fill("#dc2626");

    // Brand Title & Invoice Heading
    doc.fillColor("#111827").fontSize(26).font("Helvetica-Bold").text("KKIT", 40, 35);
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280").text("Empowering Tech Education & Solutions", 40, 65);
    doc.text("www.kkitbd.com | support@kkitbd.com", 40, 78);

    doc.fillColor("#dc2626").fontSize(20).font("Helvetica-Bold").text("INVOICE", 400, 35, { align: "right" });
    doc.fontSize(9).font("Helvetica").fillColor("#374151");
    doc.text(`Invoice No: ${invoice.invoiceNumber || "INV-" + invoice._id?.toString().slice(-6)}`, 350, 60, { align: "right" });
    doc.text(`Date: ${new Date(invoice.createdAt || Date.now()).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}`, 350, 74, { align: "right" });
    
    // Status Pill
    const statusText = (invoice.status || "PAID").toUpperCase();
    doc.fillColor(statusText === "PAID" ? "#16a34a" : "#dc2626").fontSize(10).font("Helvetica-Bold").text(`Status: ${statusText}`, 350, 88, { align: "right" });

    // Divider Line
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(40, 110).lineTo(555, 110).stroke();

    // Two-Column Section: Bill To & Payment Details
    const yStart = 125;

    // Bill To
    doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("BILLED TO:", 40, yStart);
    doc.fontSize(9).font("Helvetica").fillColor("#374151");
    const billing = invoice.billingDetails || {};
    const userName = billing.name || invoice.user?.name || "Valued Student";
    const userEmail = billing.email || invoice.user?.email || "N/A";
    const userPhone = billing.phone || invoice.user?.phone || "";
    
    doc.text(userName, 40, yStart + 16);
    doc.text(userEmail, 40, yStart + 30);
    if (userPhone) doc.text(`Phone: ${userPhone}`, 40, yStart + 44);

    // Payment Information
    doc.fillColor("#111827").fontSize(11).font("Helvetica-Bold").text("PAYMENT DETAILS:", 330, yStart);
    doc.fontSize(9).font("Helvetica").fillColor("#374151");
    const method = invoice.payment?.method || invoice.paymentMethod || "bKash / Online";
    const trxId = invoice.payment?.transactionId || invoice.transactionId || "N/A";
    doc.text(`Method: ${method.toUpperCase()}`, 330, yStart + 16);
    doc.text(`Transaction ID: ${trxId}`, 330, yStart + 30);
    if (invoice.payment?.paidAt || invoice.paidAt) {
      doc.text(`Paid On: ${new Date(invoice.payment?.paidAt || invoice.paidAt).toLocaleDateString("en-BD")}`, 330, yStart + 44);
    }

    // Items Table Header
    let tableTop = 205;
    doc.rect(40, tableTop, 515, 24).fill("#f3f4f6");

    doc.fillColor("#111827").fontSize(9).font("Helvetica-Bold");
    doc.text("ITEM / COURSE DESCRIPTION", 52, tableTop + 7, { width: 330 });
    doc.text("QTY", 380, tableTop + 7, { width: 40, align: "center" });
    doc.text("AMOUNT (Tk.)", 430, tableTop + 7, { width: 115, align: "right" });

    // Items Rows
    let y = tableTop + 30;
    doc.font("Helvetica").fontSize(9).fillColor("#374151");

    const lineItems = items && items.length > 0 ? items : [
      { description: invoice.course?.title || invoice.description || "KKIT Premium Course Enrollment", amount: invoice.amount || invoice.total || 0 }
    ];

    lineItems.forEach((item, index) => {
      if (index % 2 === 1) {
        doc.rect(40, y - 4, 515, 22).fill("#f9fafb");
      }
      doc.fillColor("#111827");
      doc.text(item.description || "Course / Service Fee", 52, y, { width: 330 });
      doc.text("1", 380, y, { width: 40, align: "center" });
      const itemAmt = Number(item.amount || 0).toLocaleString("en-US");
      doc.text(`Tk. ${itemAmt}`, 430, y, { width: 115, align: "right" });
      y += 22;
    });

    // Divider
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(40, y + 4).lineTo(555, y + 4).stroke();
    y += 15;

    // Totals Box (Right Aligned)
    const subtotal = Number(invoice.amount || invoice.subtotal || invoice.total || 0);
    const tax = Number(invoice.tax || 0);
    const discount = Number(invoice.discount || 0);
    const total = Number(invoice.total || (subtotal + tax - discount));

    doc.fontSize(9).font("Helvetica").fillColor("#4b5563");
    doc.text("Subtotal:", 350, y, { width: 90, align: "right" });
    doc.text(`Tk. ${subtotal.toLocaleString("en-US")}`, 450, y, { width: 95, align: "right" });
    y += 18;

    if (discount > 0) {
      doc.text("Discount:", 350, y, { width: 90, align: "right" });
      doc.text(`- Tk. ${discount.toLocaleString("en-US")}`, 450, y, { width: 95, align: "right" });
      y += 18;
    }

    if (tax > 0) {
      doc.text("Tax (VAT):", 350, y, { width: 90, align: "right" });
      doc.text(`Tk. ${tax.toLocaleString("en-US")}`, 450, y, { width: 95, align: "right" });
      y += 18;
    }

    // Total Highlight Box
    doc.rect(345, y, 210, 28).fill("#fef2f2");
    doc.strokeColor("#fca5a5").lineWidth(1).rect(345, y, 210, 28).stroke();

    doc.fillColor("#dc2626").fontSize(11).font("Helvetica-Bold");
    doc.text("Grand Total:", 355, y + 8, { width: 90, align: "left" });
    doc.text(`Tk. ${total.toLocaleString("en-US")}`, 445, y + 8, { width: 100, align: "right" });

    // Footer
    const footerY = 780;
    doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(40, footerY).lineTo(555, footerY).stroke();
    doc.fillColor("#9ca3af").fontSize(8).font("Helvetica");
    doc.text("Thank you for learning with KKIT! This is a system-generated official invoice.", 40, footerY + 10, { align: "center", width: 515 });
    doc.text("KKIT Institute | Level 4, Tech Tower, Dhaka, Bangladesh | www.kkitbd.com", 40, footerY + 22, { align: "center", width: 515 });

    doc.end();
  });
};

module.exports = { generateInvoicePDF };
