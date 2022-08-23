const mongoose = require('mongoose')

const TenantSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profilePic:{
        type: String,
        default:""
    },
    phone:{
        type:String,
        required:true,
    },
    room:{
        type:String,
        unique:true,
    },
    amount:{
        type:String,
        default:0.00,
    }
},
{timestamps:true}
);
module.exports = mongoose.model("Tenant", TenantSchema);