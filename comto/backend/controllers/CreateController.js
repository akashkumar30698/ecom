const Product = require("../model/ProductModel");

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
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
   const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
   return res.json(updated);
   }catch(err){
       console.log("some error occured",err)
      return  res.status(500).json({ message: err.message });
   }
 
}

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
