const Certificate = require("./certificate.model");
const Enrollment = require("../enrollment/enrollment.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { generateCertificatePDF } = require("../../services/pdf/certificate.pdf");
const { sendEmail } = require("../../services/email/email.service");

const getAllCertificates = async (query, options) => {
  const filter = {};
  if (query.user) filter.user = query.user;
  if (query.course) filter.course = query.course;
  return paginate(Certificate, filter, { ...options, populate: "user course" });
};

const getCertificateById = async (id) => {
  const cert = await Certificate.findById(id).populate("user", "name email").populate("course", "title");
  if (!cert) throw ApiError.notFound("Certificate not found");
  return cert;
};

const generateCertificate = async (data) => {
  const enrollment = await Enrollment.findById(data.enrollment).populate("user course");
  if (!enrollment) throw ApiError.notFound("Enrollment not found");
  if (enrollment.status !== "completed") throw ApiError.badRequest("Enrollment not completed");

  const existing = await Certificate.findOne({ enrollment: data.enrollment });
  if (existing) throw ApiError.conflict("Certificate already exists");

  const certData = {
    studentName: enrollment.user.name,
    courseName: enrollment.course.title,
    date: new Date().toLocaleDateString(),
    certificateNumber: "", // will be auto-generated
  };

  const pdfBuffer = await generateCertificatePDF(certData);

  const certificate = await Certificate.create({
    user: enrollment.user._id,
    course: enrollment.course._id,
    enrollment: enrollment._id,
    studentName: enrollment.user.name,
    courseName: enrollment.course.title,
    completionDate: new Date(),
  });

  // Link certificate to enrollment
  enrollment.certificate = certificate._id;
  await enrollment.save();

  // Send email
  sendEmail({
    to: enrollment.user.email,
    subject: "Congratulations! Your Certificate is Ready",
    template: "certificate",
    data: { name: enrollment.user.name, courseName: enrollment.course.title },
    attachments: [{
      filename: `certificate-${certificate.certificateNumber}.pdf`,
      content: pdfBuffer,
    }],
  }).catch(() => {});

  return certificate;
};

module.exports = { getAllCertificates, getCertificateById, generateCertificate };
