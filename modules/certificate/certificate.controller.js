const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const certificateService = require("./certificate.service");

const getAllCertificates = catchAsync(async (req, res) => {
  const result = await certificateService.getAllCertificates(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getCertificateById = catchAsync(async (req, res) => {
  const cert = await certificateService.getCertificateById(req.params.id);
  ApiResponse.success(res, cert);
});

const verifyCertificate = catchAsync(async (req, res) => {
  const cert = await certificateService.verifyCertificate(req.params.number);
  ApiResponse.success(res, cert, "Certificate verified");
});

const generateCertificate = catchAsync(async (req, res) => {
  const { certificate, pdfBuffer } = await certificateService.generateCertificate(req.body);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`,
  });
  res.send(pdfBuffer);
});

module.exports = { getAllCertificates, getCertificateById, verifyCertificate, generateCertificate };
