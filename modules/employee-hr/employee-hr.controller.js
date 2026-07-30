const { Attendance, LeaveRequest, LedgerTransaction } = require("./employee-hr.model");
const catchAsync = require("../../utils/catchAsync");
const apiResponse = require("../../utils/apiResponse");

// Initial Seed Data if collections are empty
const SEED_ATTENDANCE = [
  { employeeName: "Arif Rahman", role: "Trainer", date: "Today", status: "present", inTime: "09:05 AM", outTime: "06:00 PM", notes: "On time" },
  { employeeName: "Tanvir Hossain", role: "Admin", date: "Today", status: "present", inTime: "09:00 AM", outTime: "06:15 PM", notes: "On time" },
  { employeeName: "Nusrat Jahan", role: "Mentor", date: "Today", status: "late", inTime: "09:45 AM", outTime: "06:00 PM", notes: "Traffic delay" },
  { employeeName: "Sabbir Ahmed", role: "Support", date: "Today", status: "absent", inTime: "—", outTime: "—", notes: "Uninformed absence" },
  { employeeName: "Mehedi Hasan", role: "Finance", date: "Today", status: "leave", inTime: "—", outTime: "—", notes: "Approved Sick Leave" },
];

const SEED_LEAVES = [
  { employeeName: "Mehedi Hasan", role: "Finance", type: "Sick Leave", from: "2026-07-30", to: "2026-07-31", days: 2, status: "approved", reason: "Fever and rest recommended by doctor" },
  { employeeName: "Nusrat Jahan", role: "Mentor", type: "Casual Leave", from: "2026-08-05", to: "2026-08-06", days: 2, status: "pending", reason: "Family event in hometown" },
  { employeeName: "Sabbir Ahmed", role: "Support", type: "Emergency Leave", from: "2026-08-10", to: "2026-08-10", days: 1, status: "pending", reason: "Personal emergency" },
];

const SEED_LEDGER = [
  { title: "Monthly Payroll - July 2026", category: "salary", type: "debit", amount: 245000, date: "2026-07-28", status: "completed", note: "Paid 6 staff salaries" },
  { title: "Founder Capital Investment", category: "investment", type: "credit", amount: 500000, date: "2026-07-01", status: "completed", note: "Equipment & scaling fund" },
  { title: "HQ Office Rent July", category: "office_rent", type: "debit", amount: 45000, date: "2026-07-05", status: "completed", note: "Commercial space lease" },
  { title: "AWS Cloud & Vercel Pro", category: "server_software", type: "debit", amount: 18500, date: "2026-07-12", status: "completed", note: "Server infrastructure" },
  { title: "Client Custom ERP Development", category: "client_revenue", type: "credit", amount: 180000, date: "2026-07-20", status: "completed", note: "First milestone payment" },
  { title: "MacBook Pro for Sr Dev", category: "equipment", type: "debit", amount: 165000, date: "2026-07-15", status: "completed", note: "Hardware investment" },
];

// Attendance
exports.getAttendance = catchAsync(async (req, res) => {
  let list = await Attendance.find().sort({ createdAt: -1 });
  if (list.length === 0) {
    list = await Attendance.insertMany(SEED_ATTENDANCE);
  }
  return apiResponse.success(res, "Attendance retrieved successfully", list);
});

exports.updateAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, notes, inTime, outTime } = req.body;
  const item = await Attendance.findByIdAndUpdate(
    id,
    { status, notes, inTime, outTime },
    { new: true }
  );
  return apiResponse.success(res, "Attendance updated successfully", item);
});

// Leaves
exports.getLeaves = catchAsync(async (req, res) => {
  let list = await LeaveRequest.find().sort({ createdAt: -1 });
  if (list.length === 0) {
    list = await LeaveRequest.insertMany(SEED_LEAVES);
  }
  return apiResponse.success(res, "Leave requests retrieved successfully", list);
});

exports.updateLeaveStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const item = await LeaveRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return apiResponse.success(res, "Leave status updated successfully", item);
});

exports.createLeave = catchAsync(async (req, res) => {
  const item = await LeaveRequest.create(req.body);
  return apiResponse.success(res, "Leave request created successfully", item, 201);
});

// Ledger / Payroll
exports.getLedger = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== "all" ? { category } : {};
  let list = await LedgerTransaction.find(filter).sort({ createdAt: -1 });
  if (list.length === 0 && (!category || category === "all")) {
    list = await LedgerTransaction.insertMany(SEED_LEDGER);
  }
  return apiResponse.success(res, "Ledger retrieved successfully", list);
});

exports.createLedgerEntry = catchAsync(async (req, res) => {
  const item = await LedgerTransaction.create(req.body);
  return apiResponse.success(res, "Ledger transaction recorded successfully", item, 201);
});
