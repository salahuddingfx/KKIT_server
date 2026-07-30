const express = require("express");
const router = express.Router();
const controller = require("./employee-hr.controller");

// Attendance Routes
router.get("/attendance", controller.getAttendance);
router.put("/attendance/:id", controller.updateAttendance);

// Leave Request Routes
router.get("/leaves", controller.getLeaves);
router.post("/leaves", controller.createLeave);
router.put("/leaves/:id/status", controller.updateLeaveStatus);

// HR Payroll & Ledger Routes
router.get("/ledger", controller.getLedger);
router.post("/ledger", controller.createLedgerEntry);

module.exports = router;
