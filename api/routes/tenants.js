const router = require("express").Router();
const Tenant = require("../models/Tenant");

// add new tenat
router.post("/addtenant", async(req,res)=>{
    try {
        const newTenant = new Tenant({
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            room : req.body.room,
            amount : req.body.amount,    

        })
        const user = await newTenant.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;

//CREATE POST
// router.post("/tenants", async(req,res) =>{
//     const newPost = new Tenant(req.body);
//     try {
//         const savedPost = await newPost.save();
//         res.status(200).json(savedPost);
//     } catch (error) {
//         res.status(500).json(error)
//     }
// });