const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const emailCampaignService = require("./email-campaign.service");

const getAllCampaigns = catchAsync(async (req, res) => {
  const result = await emailCampaignService.getAllCampaigns(req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getCampaignById = catchAsync(async (req, res) => {
  const campaign = await emailCampaignService.getCampaignById(req.params.id);
  ApiResponse.success(res, campaign);
});

const createCampaign = catchAsync(async (req, res) => {
  const campaign = await emailCampaignService.createCampaign(req.body, req.user._id);
  ApiResponse.created(res, campaign, "Campaign created successfully");
});

const updateCampaign = catchAsync(async (req, res) => {
  const campaign = await emailCampaignService.updateCampaign(req.params.id, req.body);
  ApiResponse.success(res, campaign, "Campaign updated successfully");
});

const deleteCampaign = catchAsync(async (req, res) => {
  await emailCampaignService.deleteCampaign(req.params.id);
  ApiResponse.success(res, null, "Campaign deleted successfully");
});

const sendCampaign = catchAsync(async (req, res) => {
  const campaign = await emailCampaignService.sendCampaign(req.params.id);
  ApiResponse.success(res, campaign, "Campaign sent successfully");
});

const getCampaignStats = catchAsync(async (req, res) => {
  const stats = await emailCampaignService.getCampaignStats(req.params.id);
  ApiResponse.success(res, stats);
});

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  getCampaignStats,
};
