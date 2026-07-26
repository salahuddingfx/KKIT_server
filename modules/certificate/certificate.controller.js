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

const generateCertificate = catchAsync(async (req, res) => {
  const cert = await certificateService.generateCertificate(req.body);
  ApiResponse.created(res, cert, "Certificate generated");
});

module.exports = { getAllCertificates, getCertificateById, generateCertificate };
