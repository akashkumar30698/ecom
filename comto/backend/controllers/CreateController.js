const Product = require("../model/ProductModel");

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    if(!req.body.searchByUniqueId){
      return  res.status(500).json({ message: "no search id found" });
    }
    const savedProduct = await newProduct.save();
    return  res.status(201).json(savedProduct);
  } catch (err) {
   return  res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
    try{
           await Product.findByIdAndDelete(req.params.id);
        return    res.json({ message: "Deleted" });
    }catch(err){
        console.log("some error occured",err)
      return  res.status(500).json({ message: err.message });
    } 
};

const PutProduct = async (req, res) => {
  try {
   // const { searchByUniqueId } = req.params;

    if (!req.body.searchByUniqueId) {
      return res.status(400).json({ message: "Missing product identifier changed" });
    }

    // Update by searchByUniqueId field
    const updated = await Product.findOneAndUpdate(
      { searchByUniqueId: req.body.searchByUniqueId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


const getAllThings = async (req, res) => {
  try {
   const products = await Product.find();
   return  res.json(products); 
   
   } catch(err){
      console.log("some error occured",err)
      return  res.status(500).json({ message: err.message });
    }

}

module.exports = { 
    createProduct ,
    deleteProduct,
    PutProduct,
    getAllThings
};
