const express = require("express");
const router = express.Router();
const Product = require("../model/ProductModel");
const  { createProduct,deleteProduct,PutProduct,getAllThings } = require("../controllers/CreateController")

// Get all products
router.get("/", getAllThings);

// Update product
router.put("/:id",PutProduct);

router.post("/", createProduct);


// Delete product
router.delete("/:id",deleteProduct)

module.exports = {
    router
}
