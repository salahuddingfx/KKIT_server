const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const User = sequelize.define(
  "User",
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    avatar: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    address: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    bio: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    designation: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    socialLinks: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    enrolledCourses: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    completedLessons: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    wishlist: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    passwordResetExpire: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    loginHistory: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    fcmTokens: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    otpCode: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    otpExpire: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    otpPurpose: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.generateAccessToken = function () {
  return jwt.sign({ id: this.id || this._id, role: this.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign({ id: this.id || this._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  });
};

enhanceModel(User);

module.exports = User;
