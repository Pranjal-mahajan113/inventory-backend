const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    referenceNumber: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
