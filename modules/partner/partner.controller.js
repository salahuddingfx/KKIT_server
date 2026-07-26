const partnerService = require("./partner.service");
const ApiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");

const getPartners = catchAsync(async (req, res) => {
  const partners = await partnerService.getAll(req.query);
  ApiResponse.success(res, partners, "Partners fetched");
});

const getPartnerById = catchAsync(async (req, res) => {
  const partner = await partnerService.getById(req.params.id);
  ApiResponse.success(res, partner, "Partner fetched");
});

const createPartner = catchAsync(async (req, res) => {
  const partner = await partnerService.create(req.body);
  ApiResponse.created(res, partner, "Partner created");
});

const updatePartner = catchAsync(async (req, res) => {
  const partner = await partnerService.update(req.params.id, req.body);
  ApiResponse.success(res, partner, "Partner updated");
});

const deletePartner = catchAsync(async (req, res) => {
  await partnerService.remove(req.params.id);
  ApiResponse.success(res, null, "Partner deleted");
});

module.exports = { getPartners, getPartnerById, createPartner, updatePartner, deletePartner };
