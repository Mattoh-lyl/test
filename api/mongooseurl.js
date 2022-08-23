require('dotenv').config();
const mongoose=require('mongoose');
const url=process.env.MONGOURL;
function urls(){
   

mongoose.connect(url).then((db)=>{

  console.log  ('MONGODB CONNECTION ESTABLISHED!');
} );
}

//export the file
urls();
module.exports=urls;