const Certificate = require("./certificate.model");
const Enrollment = require("../enrollment/enrollment.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { generateCertificatePDF } = require("../../services/pdf/certificate.pdf");
const { sendEmail } = require("../../services/email/email.service");
const env = require("../../config/env");

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

const verifyCertificate = async (certificateNumber) => {
  const cert = await Certificate.findOne({ certificateNumber })
    .populate("user", "name email")
    .populate("course", "title");
  if (!cert) throw ApiError.notFound("Certificate not found");
  if (cert.status !== "active") throw ApiError.badRequest("Certificate is revoked");
  return cert;
};

const generateCertificate = async (data) => {
  const enrollment = await Enrollment.findById(data.enrollment).populate("user course");
  if (!enrollment) throw ApiError.notFound("Enrollment not found");
  if (enrollment.status !== "completed") throw ApiError.badRequest("Enrollment not completed");

  const existing = await Certificate.findOne({ enrollment: data.enrollment });
  if (existing) throw ApiError.conflict("Certificate already exists");

  const verificationUrl = `${env.CLIENT_URL || "https://kkitbd.com"}/verify-certificate`;

  const certificate = await Certificate.create({
    user: enrollment.user._id,
    course: enrollment.course._id,
    enrollment: enrollment._id,
    studentName: enrollment.user.name,
    courseName: enrollment.course.title,
    completionDate: new Date(),
  });

  const certData = {
    studentName: enrollment.user.name,
    courseName: enrollment.course.title,
    date: new Date().toLocaleDateString(),
    certificateNumber: certificate.certificateNumber,
    verificationUrl,
  };

  const pdfBuffer = await generateCertificatePDF(certData);

  certificate.pdfUrl = `/uploads/certificates/${certificate.certificateNumber}.pdf`;
  await certificate.save();

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

  return { certificate, pdfBuffer };
};

module.exports = { getAllCertificates, getCertificateById, verifyCertificate, generateCertificate };
