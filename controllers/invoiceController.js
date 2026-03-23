const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

// ================= CREATE INVOICE =================
const createInvoice = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔐 CHECK: product belongs to logged-in user
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Out of stock",
      });
    }
    // Reduce product stock
    product.quantity -= quantity;
    await product.save();

    // Generate invoiceId (simple example)
    const lastInvoice = await Invoice.findOne({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    let nextId = 1001;
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceId.split("-")[1]);
      nextId = lastNumber + 1;
    }

    const invoiceId = `INV-${nextId}`;

    const amount = product.price * quantity;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = await Invoice.create({
      invoiceId,
      referenceNumber: product._id,
      productId: product._id,
      userId: req.user._id,
      quantity,
      amount,
      status: "Unpaid",
      dueDate,
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL INVOICES =================

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .populate("productId", "name price")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= MARK AS PAID =================
const markAsPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice.status = "Paid";
    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Invoice marked as PAID",
      data: invoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= DELETE INVOICE =================
const deleteInvoice = async (req, res) => {
  try {
    // Find invoice belonging to logged-in user
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Only allow delete if invoice is PAID
    if (invoice.status !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete unpaid invoice",
      });
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Invoice deleted",
    });
  } catch (error) {
    console.error("Delete invoice error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  markAsPaid,
  deleteInvoice,
};
