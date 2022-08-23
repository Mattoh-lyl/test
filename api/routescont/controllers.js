require('dotenv').config()
const usermodel=require('../usermodel');
// variable defination
const axios=require('axios');
const { response } = require('express');
const PASSKEY=process.env.PASSKEY;
const SHORTCODE=process.env.SHORTCODE;
const CONSUMERKEY=process.env.CONSUMERKEY;
const CONSUMERSECRET=process.env.CONSUMERSECRET;


//date and time function required to create a password in the format recommended by safaricom
const datetime= require('node-datetime')
const dt= datetime.create();
const formatted=dt.format("YMdHMS");


// function to create password
const NewPassword = ()=>{
    
    
    const passkey= SHORTCODE + PASSKEY + formatted;
   
    const base64encodedpass=Buffer.from(passkey).toString('base64');
    return base64encodedpass;
}

//this is an expoort tha corresspond to the token generation route in the mpesaroutes  folder
//it is responsible for creating the authorization token required during stk push
 module.exports.token=async (req,res,next)=>
 {
  
     const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
   const auth ='Basic '+ Buffer.from(CONSUMERKEY+':'+CONSUMERSECRET).toString('base64');
     
    const headers={Authorization: auth,};
    axios.get(url,{headers})
    .then((response)=>
    {
        
        let data=response.data;//response.data is the response that the safaricom give after validating the detail sent in search of authorization token
        let accesstoken=data.access_token;// data.access_token is the token sent by safaricom in the data object
        console.log(accesstoken);
        
        req.token=data.access_token;
    next();
})
   .catch((error)=>
   {
       res.send(error)
       console.log(error)}) 

 };

/*  
The method defined is experted to the mpesa routes where it corressponds to the stk/push  method itself that perform the push
*/
  module.exports.stkpush= async(req,res,next)=>
 {
     const token=req.token;//got from authorization token sent by safaricom in the pravious step
     const{pno,amount}=req.body//got from the react form
     const body=req.body;

   const headers={
       Authorization: 'Bearer '+token,//header specifications by safaricom. 'Bearer 'is pre-defined by safaricom  in their Documentation
   }
   const stkurl='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';


   let data=
   {
      /*pre-defined information required to perform the stk push */
        BusinessShortCode:'174379',    
        Password: NewPassword(),    
      Timestamp:formatted,    
      TransactionType: 'CustomerPayBillOnline',    
        Amount:amount,    
       PartyA:pno,    
        PartyB:'174379',    
      PhoneNumber:pno,    
      CallBackURL:"https://mpesa-react.herokuapp.com/callback",// callback url, your are supposed to use your domain url
      // the /callback is the url to recieve the safariom response about the transaction
      
      AccountReference:"mpesa app payment test",    
      TransactionDesc:"lipa Na M-PESA"
      
   };
    axios.post(stkurl,data,{headers}).then((response)=>
{
    
   
        res.send(response.data )
        console.log(response.data)
    
   next();

}).catch((error)=>
{
    console.log(error)
    res.json({"message" : error.response.data.errorMessage})
    }) ;

  
 }

/* the stk callback funtion where our response is directed to from the safaricom.
it must be defined after the domain url as show on the pravious step.
*/
module.exports.callback=async (req,res)=>
{
console.log('-------------------------Stk---------')
if(req.body.Body. stkCallback.ResultDesc==="Request cancelled by user")// this  response shows when the request is cancelled by the client
{
    console.log(req.body)
}
else{
    console.log(req.body.Body.stkCallback.CallbackMetadata)// the callbackmetadata is an object with all information about the transaction
    var transactiondetails=new usermodel(
        {
            Transactioncode: req.body.Body.stkCallback.CallbackMetadata.Item[1].Value,
            Amount: req.body.Body.stkCallback.CallbackMetadata.Item[0].Value,
            PhoneNumber: req.body.Body.stkCallback.CallbackMetadata.Item[4].Value,
            
           TransactionDate: req.body.Body.stkCallback.CallbackMetadata.Item[3].Value
        }
    )
    
    transactiondetails .save((err, doc) => {
        if (!err)
            console.log('success: Transaction recorded');
            
        else
            console.log( err);
  });

  
   
}


}