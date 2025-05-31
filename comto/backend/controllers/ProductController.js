// controllers/productController.js
const Product = require("../model/ProductModel")

// Add a new product
 const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
 return   res.status(201).json(saved);
  } catch (err) {
  return  res.status(400).json({ error: err.message });
  }
};

// Get all products
 const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
 return  res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
   return res.json(product);
  } catch (err) {
 return   res.status(500).json({ error: err.message });
  }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById
}