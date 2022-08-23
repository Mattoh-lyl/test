const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require ("./routes/auth")
const userRoute = require ("./routes/users")
const postRoute = require ("./routes/posts")
const categoryRoute = require ("./routes/categories")
const multer = require("multer");
const path = require("path");
const tenantRoute = require ("./routes/tenants")

// const routes=require('./mpesaroutes/routers')



dotenv.config();
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")))

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology : true,
    // useFindandModify:true
})
.then(console.log("Connected to MONGODB"))
.catch(error =>console.log(error));

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "images");
    },
    filename: (req, file, cb) =>{
        cb(null, req.body.name);
    }
});

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req,res)=>{
    res.status(200).json("File has been Uploaded successfully");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/tenants", tenantRoute);

// app.use(routes);





app.listen("5000", () =>{
    console.log("Backed is running")
});