const offerService = require("./offer.service");
const ApiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");

const getOffers = catchAsync(async (req, res) => {
  const offers = await offerService.getAll(req.query);
  ApiResponse.success(res, offers, "Offers fetched");
});

const getActiveOffers = catchAsync(async (req, res) => {
  const offers = await offerService.getActive();
  ApiResponse.success(res, offers, "Active offers fetched");
});

const getOfferById = catchAsync(async (req, res) => {
  const offer = await offerService.getById(req.params.id);
  ApiResponse.success(res, offer, "Offer fetched");
});

const createOffer = catchAsync(async (req, res) => {
  const offer = await offerService.create(req.body);
  ApiResponse.created(res, offer, "Offer created");
});

const updateOffer = catchAsync(async (req, res) => {
  const offer = await offerService.update(req.params.id, req.body);
  ApiResponse.success(res, offer, "Offer updated");
});

const deleteOffer = catchAsync(async (req, res) => {
  await offerService.remove(req.params.id);
  ApiResponse.success(res, null, "Offer deleted");
});

const validateCoupon = catchAsync(async (req, res) => {
  const offer = await offerService.validateCoupon(req.body.code);
  ApiResponse.success(res, offer, "Coupon valid");
});

module.exports = { getOffers, getActiveOffers, getOfferById, createOffer, updateOffer, deleteOffer, validateCoupon };
