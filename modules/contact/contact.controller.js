const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const contactService = require("./contact.service");

const getAllContacts = catchAsync(async (req, res) => {
  const result = await contactService.getAllContacts(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getContactById = catchAsync(async (req, res) => {
  const contact = await contactService.getContactById(req.params.id);
  ApiResponse.success(res, contact);
});

const createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body);
  ApiResponse.created(res, contact, "Message sent successfully");
});

const updateContact = catchAsync(async (req, res) => {
  const contact = await contactService.updateContact(req.params.id, req.body);
  ApiResponse.success(res, contact, "Contact updated");
});

const deleteContact = catchAsync(async (req, res) => {
  await contactService.deleteContact(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact };
