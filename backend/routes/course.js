const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const Courses = require('../models/Courses');
const Enrollment = require('../models/Enrollment');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all courses using GET 'localhost:5000/courses/fetchallcourses' NO LOGIN REQUIRED

router.get('/fetchallcourses', async (req, res) => {
    try {
        const courses = await Courses.find({});
        res.json(courses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//ROUTE 2: ADD course .. POST 'localhost:5000/courses/addcourse' NO  LOGIN REQUIRED

router.post('/addcourse', [
    body('title', 'Course Name is required').not().isEmpty(),
    body('description', 'Course Description is required').not().isEmpty(),
    body('duration', 'Course Duration is required').not().isEmpty()
], async function (req, res) {
    try {
        var success=false;
        const { title, description, duration } = req.body;

        //if there are errors return BAD REQUEST
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }

        const newCourse = new Courses({
            title,
            description,
            duration,
            createdAt: new Date()
        });

        const savedCourse = await newCourse.save();
        success=true;
        res.json({success,savedCourse});




    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


//ROUTE 3: Register for a Course.. POST->'localhost:5000/courses/register'
//LOGIN REQUIRED

router.post('/register',
    [
        body('student', 'Student ID is required').not().isEmpty(),
        body('course', 'Course ID is required').not().isEmpty(),
    ], async function (req, res) {
        let success = false;
        try {
            const { student, course } = req.body;

            // If there are errors return BAD REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }

            // Check if the student is already enrolled in the course
            const existingEnrollment = await Enrollment.findOne({ student, course });
            if (existingEnrollment) {
                return res.status(400).json({ success, message: 'Student is already enrolled in this course.' });
            }

            const newEnrollment = new Enrollment({
                student,
                course,
                enrolledAt: new Date()
            });
            success = true;

            const enrolled = await newEnrollment.save();
            res.json({ success, message: 'Registration successful !', enrolled });

        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);


//ROUTE 4: Get Student's Enrolled Courses.. POST->'localhost:5000/courses/enrolledcourses'
//LOGIN REQUIRED

router.post('/enrolledcourses', fetchUser, async (req, res) => {
    try {
        const enrolledCourses = await Enrollment.find({ student: req.student.id });
        res.json(enrolledCourses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


//ROUTE 5: Fetch Courses by CourseID...POST->'localhost:5000/courses/fetchcourse'
router.post('/fetchcourse', async function(req, res){
    try{
        const course = await Courses.findById(req.body.id);
        res.json(course);
    }catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
});


//ROUTE 6: Delete Course by Id... POST->'localhost:5000/courses/delete
    router.delete('/delete', async function(req, res){
    try{
        const course = await Courses.findByIdAndDelete(req.body.id);
        if(!course){
            return res.status(404).json({success:false, message: 'Course not found'});
        }
        res.json({success:true, message: 'Course deleted'});
    }catch(err){
        console.error(err);
        res.status(500).send({success:false,message:'Server Error'});
    }
});


//ROUTE 7: Update Course...POST->'localhost:5000/courses/update'
router.put('/update',async function (req, res) {
    var success=false;
    try{
        const course = await Courses.findByIdAndUpdate(req.body._id, req.body, {new: true});
        success=true;
        res.json({success,message:"Course updated Successfully!",course});

    }catch(err){
        console.error(err);
        res.status(500).send({success,message:'Server Error'});
    }
});

module.exports = router;