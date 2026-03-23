const Product = require("../models/Product");

// CREATE PRODUCT
const addProduct = async (req, res) => {
  try {
    const {
      name,
      productId,
      category,
      price,
      quantity,
      unit,
      expiryDate,
      threshold,
      image,
    } = req.body;

    if (!name || !productId || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const product = await Product.create({
      name,
      productId,
      category,
      price,
      quantity,
      unit,
      expiryDate,
      threshold,
      image,
      userId: req.user._id, //  JWT se aaya
    });

    res.status(201).json({
      success: true,
      message: "Product added",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get product
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { returnDocument: "after" },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
