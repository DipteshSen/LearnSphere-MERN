const express = require('express');
const router = express.Router();
const AdminSchema = require('../models/AdminSchema');
const Student= require('../models/Student');
const { body, validationResult } = require('express-validator');
/* const bcrypt = require('bcrypt'); */
var jwt = require('jsonwebtoken');
const fetchAdmin = require('../middleware/fetchadmin');
const JWT_SECRET =  process.env.JWT_SECRET || 'MonkeyDLuffy';

//ROUTE 1: ADMIN LOGIN.... POST -> 'localhost:5000/admin/login'
router.post('/login',
    [
        body('email','Please enter your email').isEmail(),
        body('password','Please enter your password').exists()
    ],async function(req,res){
        var success = false;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success, message:"Credentials not Valid",errors:errors.array()});
        }

        try{

            const admin = await AdminSchema.findOne({email:req.body.email,password:req.body.password});
            if(!admin){
                return res.status(404).json({success, message:"Admin not found"});
            }

            success=true;
            const payload = {
                admin:{
                    id:admin.id,
                }
            }

            success=true;
            const authtoken = jwt.sign(payload, JWT_SECRET);
            res.json({success, message:"Login Successful", authtoken});

        }catch(err){
            console.error(err.message);
            res.status(500).json({success, message:"Server Error"});
        }
})


//ROUTE 2 : get profile information GET->'localhost:5000/admin/profile'
//LOGIN REQUIRED

router.get('/profile',fetchAdmin,async function(req,res){
    let success = false;
    try{
        const admin = await AdminSchema.findById(req.admin.id);
        success=true;
        res.json({success, message:"Profile fetched", admin});
    }catch(err){
        console.error(err.message);
        res.status(500).json({success, message:"Server Error"});
    }
})

//ROUTE 3 : Get all Students... GET ->'localhost:5000/admin/allstudents
router.get('/getallstudents',async function(req, res){
    var success=false;
    try{
        const students=await Student.find();
        success=true;
        res.json({success, message:"All Students fetched", students});
    }catch(err){
        console.error(err.message);
        res.status(500).json({success, message:"Server Error"});
    }

})

//ROUTE 4 : Change Password.. POST-> 'localhost:5000/admin/changepassword'
router.post('/changepassword',fetchAdmin,
    [
        body('oldpassword','Please enter your current password').exists(),
        body('newpassword','Please enter your new password').exists(),
        body('confirmpassword','Confirm Password must be equal to new password').exists().custom((value, { req }) => value === req.body.newpassword)
    ] ,async function(req, res){
        success=false;
        const errors=  validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,message:errors.array()[0].msg, errors: errors.array()});
        }

        try{
            //check if old password is correct
            const admin = await AdminSchema.findById(req.admin.id);
            if(admin.password!=req.body.oldpassword){
                return res.status(400).json({success, message:"Old Password does not match"});
            }

            //change password
            admin.password=req.body.newpassword;
            await admin.save();
            success=true;
            res.json({success, message:"Password changed successfully"});



        }catch(err){
            console.error(err.message);
            res.status(500).json({success, message:"Server Error"});
        }

});


module.exports= router;