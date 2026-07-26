const Contact = require("./contact.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { sendEmail } = require("../../services/email/email.service");

const getAllContacts = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  return paginate(Contact, filter, options);
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) throw ApiError.notFound("Contact not found");
  return contact;
};

const createContact = async (data) => {
  const contact = await Contact.create(data);

  sendEmail({
    to: data.email,
    subject: "We received your message",
    template: "contactForm",
    data: { name: data.name, subject: data.subject, message: data.message },
  }).catch(() => {});

  return contact;
};

const updateContact = async (id, data) => {
  const contact = await Contact.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!contact) throw ApiError.notFound("Contact not found");
  return contact;
};

const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw ApiError.notFound("Contact not found");
  return contact;
};

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact };
