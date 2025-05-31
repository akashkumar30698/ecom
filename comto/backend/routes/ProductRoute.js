const express = require("express");
const { createProduct,getAllProducts,getProductById } = require("../controllers/ProductController");
const router = express.Router()


// POST: Add a new product
router.post("/", createProduct);

// GET: Fetch all products
router.get("/getAllProducts", getAllProducts);

// GET: Fetch single product by ID
router.get("/:id", getProductById);




module.exports = {
    router,
}