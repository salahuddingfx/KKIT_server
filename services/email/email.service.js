const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const createTransporter = require("./transporter");
const env = require("../../config/env");

const TEMPLATE_DIR = path.join(__dirname, "templates");

const loadTemplate = (templateName) => {
  const filePath = path.join(TEMPLATE_DIR, `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, "utf8");
  return handlebars.compile(source);
};

const sendEmail = async ({ to, subject, template, data = {}, attachments = [] }) => {
  try {
    const compiledTemplate = loadTemplate(template);
    const html = compiledTemplate({
      ...data,
      clientUrl: env.CLIENT_URL,
      adminUrl: env.ADMIN_URL,
    });

    const transporter = createTransporter();
    const mailOptions = {
      from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

module.exports = { sendEmail };
