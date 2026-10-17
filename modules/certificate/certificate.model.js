const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");
const { generateCertificateNumber } = require("../../utils/helpers");

const Certificate = sequelize.define(
  "Certificate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      },
    },
    certificateNumber: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enrollment: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    studentName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    completionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    pdfUrl: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
  },
  {
    tableName: "certificates",
    timestamps: true,
    hooks: {
      beforeCreate: async (cert) => {
        if (!cert.certificateNumber) {
          const count = await Certificate.count();
          cert.certificateNumber = generateCertificateNumber ? generateCertificateNumber(count + 1) : `CERT-${Date.now()}`;
        }
      },
    },
  }
);

enhanceModel(Certificate);

module.exports = Certificate;
