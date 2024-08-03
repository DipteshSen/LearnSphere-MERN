import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyCourses = (props) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const authtoken = localStorage.getItem('authtoken');

        if (!authtoken) {
            props.showAlert('warning', 'Please Login');
            navigate('/login');
            return; // Exit the effect if not authenticated
        }

        const fetchCourseData = async () => {
            try {
                // Fetching enrolled courses for the logged-in user
                const coursesRes = await fetch('http://localhost:5000/courses/enrolledcourses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': authtoken,
                    },
                });
                const coursesData = await coursesRes.json();
                setEnrolledCourses(coursesData);

                if (coursesData) {
                    const coursePromises = coursesData.map(async data => {
                        const courseRes = await fetch('http://localhost:5000/courses/fetchcourse', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: data.course }),
                        });
                        const courseData = await courseRes.json();
                        return courseData;
                    });

                    const fetchedCourses = await Promise.all(coursePromises);
                    setMyCourses(fetchedCourses);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCourseData();
    }, [navigate, props]);

    return (
        <div className='container my-5'>
            <h2>My Courses</h2>
            <div className="row">
                {myCourses.map(course => (
                    <div className="col-md-4 mb-4" key={course._id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">{course.description}</p>
                                <p className="card-text"><small className="text-muted">Duration: {course.duration} months</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyCourses;
