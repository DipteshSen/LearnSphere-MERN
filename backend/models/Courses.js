const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const courseSchema = new Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
});


module.exports=mongoose.model('Courses', courseSchema);