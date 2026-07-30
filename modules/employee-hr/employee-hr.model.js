const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    role: { type: String, default: "Staff" },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["present", "late", "absent", "leave"],
      default: "present",
    },
    inTime: { type: String, default: "09:00 AM" },
    outTime: { type: String, default: "06:00 PM" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    role: { type: String, default: "Staff" },
    type: { type: String, required: true }, // Sick Leave, Casual Leave, etc.
    from: { type: String, required: true },
    to: { type: String, required: true },
    days: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const ledgerTransactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "salary",
        "investment",
        "office_rent",
        "server_software",
        "equipment",
        "client_revenue",
        "marketing",
        "other",
      ],
      default: "salary",
    },
    type: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "completed" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
const LedgerTransaction = mongoose.model("LedgerTransaction", ledgerTransactionSchema);

module.exports = {
  Attendance,
  LeaveRequest,
  LedgerTransaction,
};
