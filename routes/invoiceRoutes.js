const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  markAsPaid,
  deleteInvoice,
} = require("../controllers/invoiceController");

// All routes protected by auth middleware if required
const protect = require("../middleware/authMiddleware");

// Create new invoice (buy products)
router.post("/", protect, createInvoice);

// Get all invoices of logged-in user
router.get("/", protect, getInvoices);

// Mark invoice as paid
router.patch("/:id/paid", protect, markAsPaid);

// Delete invoice (only if PAID)
router.delete("/:id", protect, deleteInvoice);

module.exports = router;