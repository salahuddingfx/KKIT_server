const PDFDocument = require("pdfkit");

const generateCertificatePDF = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: "landscape", margin: 0 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Border
    doc.rect(30, 30, 772, 532).lineWidth(3).stroke("#4F46E5");
    doc.rect(35, 35, 762, 522).lineWidth(1).stroke("#4F46E5");

    // Title
    doc.fontSize(14).fillColor("#6b7280").text("CERTIFICATE OF COMPLETION", 0, 80, { align: "center" });
    doc.moveDown(0.5);

    // Name
    doc.fontSize(36).fillColor("#111827").text(data.studentName, 0, 130, { align: "center", width: 800 });
    doc.moveDown(0.3);

    // Line
    doc.moveTo(250, 185).lineTo(550, 185).lineWidth(1).stroke("#4F46E5");

    // Description
    doc.fontSize(14).fillColor("#6b7280").text("has successfully completed the course", 0, 200, { align: "center" });
    doc.moveDown(0.3);

    // Course name
    doc.fontSize(24).fillColor("#4F46E5").text(data.courseName, 0, 240, { align: "center", width: 800 });
    doc.moveDown(1);

    // Date
    doc.fontSize(12).fillColor("#6b7280").text(`Date: ${data.date}`, 0, 310, { align: "center" });

    // Certificate number
    doc.fontSize(10).text(`Certificate #: ${data.certificateNumber}`, 0, 340, { align: "center" });

    // Signature line
    doc.moveTo(150, 450).lineTo(300, 450).lineWidth(1).stroke("#9ca3af");
    doc.fontSize(10).fillColor("#6b7280").text("Authorized Signature", 150, 460, { width: 150, align: "center" });

    // KKIT stamp
    doc.moveTo(500, 450).lineTo(650, 450).lineWidth(1).stroke("#9ca3af");
    doc.text("KKIT Official Seal", 500, 460, { width: 150, align: "center" });

    doc.end();
  });
};

module.exports = { generateCertificatePDF };
