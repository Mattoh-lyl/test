const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async(req,res) =>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },
            {new: true}
            );
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(401).json("You can only update your account")
    }
});


//DELETE
router.delete("/:id", async(req,res) =>{
    if(req.body.userId === req.params.id){
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({username: user.username});
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("User has been deleted");
               } catch (error) {
                   res.status(500).json(error)
               }
        } catch (error) {
            res.status(404).json("user not found");
        }
        
    }else{
        res.status(401).json("You can only delete your account")
    }
});

//GET USER
router.get("/:id", async(req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})
 
// mine
// Get all users
router.get("/", async(req,res)=>{
    try {
        const user = await User.find();
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/del', async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.body.id);
        return res.status(200).json({ success: true, msg: 'Product Deleted' });
    }
    catch(err){
        console.error(err);
    }
});
module.exports = router;