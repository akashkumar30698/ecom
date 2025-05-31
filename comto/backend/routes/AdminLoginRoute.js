const express = require("express");
const { handleAdminLogin } = require("../controllers/authControllers");
const router = express.Router()




//home
router.get("/",(req,res)=>{
    res.json({message : "successfully connected"})
})

router.post('/admin-login',handleAdminLogin);




module.exports = {
    router,
}