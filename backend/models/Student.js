const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,

    },
    mobile: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    college:{
        type: String,
    }



});

module.exports = mongoose.model('student', studentSchema);