const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { body, validationResult } = require('express-validator');
/* const bcrypt = require('bcrypt'); */
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchuser');
const JWT_SECRET =  process.env.JWT_SECRET || 'MonkeyDLuffy';


//ROUTE 1: STUDENT SIGN UP.... POST -> 'localhost:5000/student/signup'
router.post('/signup',
    [
        body('name', 'Enter a valid name').exists(),
        body('email', 'Enter a valid email').exists(),
        body('mobile', 'Enter a mobile number').exists(),
        body('address', 'Enter a address').exists(),
        body('password', 'Password can\'t be empty').exists()
    ],
    async (req, res) => {
        let success = false;
        //if there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success,message:"Registration Failed ! Try Again.", errors: errors.array() });
        }
        try {

            let student = await Student.findOne({ email: req.body.email });
            if (student) {
                return res.status(400).json({ success, message: 'Email already exists' });
            }

            //Create a new student
            student = await Student.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                mobile: req.body.mobile,
                address: req.body.address
            });

            const payload = {
                student: {
                    id: student.id,
                }
            }

            success = true;
            const authtoken = jwt.sign(payload, JWT_SECRET);

            res.json({ success, message: 'Registration Successful', authtoken });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ success, message: 'Server Error' });
        }

    });

//ROUTE 2: STUDENT LOGIN.... POST -> 'localhost:5000/student/login'
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can\'t be empty').exists()
],
    async (req, res) => {
        let success = false;
        //if there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            let student = await Student.findOne({ email: req.body.email, password: req.body.password });
            if (!student) {
                return res.status(401).json({ success, message: 'Invalid Credentials' });
            }

            const payload = {
                student: {
                    id: student.id,
                }
            }

            success = true;
            const authtoken = jwt.sign(payload, JWT_SECRET);

            res.json({ success, message: 'Login Successful', authtoken });


        } catch (err) {
            console.error(err);
            return res.status(500).json({ success, message: 'Server Error' });
        }
    });



//ROUTE 3: GET DETAILS OF A STUDENT FROM AUTHTOKEN.... GET -> 'localhost:5000/student/getuser'
//LOGIN REQUIRED
router.post('/getuser',fetchUser,async (req, res)=>{
    let success = false;
    try {
        const student = await Student.findById(req.student.id);
        res.send(student);
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success, message: 'Server Error' });
    }
})


//ROUTE 4: UPDATE STUDENT DETAILS.... PUT -> 'localhost:5000/student/update'
router.put('/update', async (req, res)=>{

    let success = false;
    try {
        let student = await Student.findByIdAndUpdate(req.body._id, req.body, {new: true});
        success=true;
        res.json({success,message:"Updated Profile Successfully !",student});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success, message: 'Server Error' });
    }
})

//ROUTE 5: Delete Student Accnt by Id... POST->'localhost:5000/student/delete
router.delete('/delete', async function(req, res){
    try{
        const student = await Student.findByIdAndDelete(req.body.id);
        if(!student){
            return res.status(404).json({success:false, message: 'Student not found'});
        }
        res.json({success:true, message: 'Student\'s account deleted'});
    }catch(err){
        console.error(err);
        res.status(500).send({success:false,message:'Server Error'});
    }
});

///ROUTE 6: Fetch Student By Id... POST-> 'localhost:5000/student/fetchstudentbyid'
router.post('/fetchstudentbyid',async function(req, res) {
    try {
        const student = await Student.findById(req.body.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ success: true, student });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
})


module.exports = router;

