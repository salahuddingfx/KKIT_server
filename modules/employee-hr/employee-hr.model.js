const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const { enhanceModel } = require("../../config/sqlAdapter");

const Attendance = sequelize.define(
  "Attendance",
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
    employeeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: "Staff",
    },
    date: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "present",
    },
    inTime: {
      type: DataTypes.STRING(50),
      defaultValue: "09:00 AM",
    },
    outTime: {
      type: DataTypes.STRING(50),
      defaultValue: "06:00 PM",
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    tableName: "attendances",
    timestamps: true,
  }
);

const LeaveRequest = sequelize.define(
  "LeaveRequest",
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
    employeeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: "Staff",
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    days: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "leave_requests",
    timestamps: true,
  }
);

const LedgerTransaction = sequelize.define(
  "LedgerTransaction",
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: "salary",
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "completed",
    },
    note: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    tableName: "ledger_transactions",
    timestamps: true,
  }
);

enhanceModel(Attendance);
enhanceModel(LeaveRequest);
enhanceModel(LedgerTransaction);

module.exports = {
  Attendance,
  LeaveRequest,
  LedgerTransaction,
};
