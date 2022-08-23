const mongoose=require('mongoose')
const schema=mongoose.Schema;

const userschema= schema(
    {
        Transactioncode:
      {
          type:String,
          
      }  ,
      Amount:
      {
type:String,

      },
      PhoneNumber :
      {
          type:String
          
      },
      TransactionDate:
      {
        type:String   
      }
    }
)
var transactionDetails=mongoose.model("transactionDetails",userschema)

module.exports=mongoose.model("transactionDetails",userschema);