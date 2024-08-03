// Connect to MongoDB
const mongoose=require('mongoose');


const connectToMongo=()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/school');
        console.log('Connected to MongoDB');
    }catch(e){
        console.log(e.message);
    }
}

module.exports=connectToMongo;