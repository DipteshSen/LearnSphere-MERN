import React, { useEffect, useState } from 'react';
import $ from 'jquery';

const Courses = (props) => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", duration: 1 });

    useEffect(() => {
        fetch('http://localhost:5000/courses/fetchallcourses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCourses(data);
                } else {
                    console.error('Expected an array but received:', data);
                }
            })
            .catch(error => console.error('Error:', error));


        console.log(courses);
        console.log(formData);
    }, []);

    const handleSubmit =async (e) => {
        e.preventDefault();
        document.getElementById('submitBtn').disabled=true;
        await fetch('http://localhost:5000/courses/addcourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    props.showAlert('success', 'Course added successfully');
                    setCourses([...courses, data.course]);
                    setFormData({ title: "", description: "", duration: "" });
                } else {
                    props.showAlert('danger', 'Failed to add course');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const onChange = (e) => {
        document.getElementById('submitBtn').disabled=false;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className="container my-4">
                <div className='container' style={{ backgroundColor: "#e7f3ff", padding: "10px", borderRadius: "16px" }}>
                    <button id='buttonopen' className='btn btn-primary my-3' onClick={() => { $('#mkform').slideDown(); }}>Add a Course</button>
                    <div style={{ display: "none" }} id="mkform" className="container my-4">
                        <h3>Add a Course</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 my-3">
                                <label htmlFor="title" className="form-label">Course Title</label>
                                <input onChange={onChange} value={formData.title} type="text" className="form-control" id="title" name="title" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Course Description</label>
                                <input onChange={onChange} value={formData.description} type="text" className="form-control" id="description" name="description" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="duration" className="form-label">Course Duration</label>
                                <input onChange={onChange} value={formData.duration} type="text" className="form-control" id="duration" name="duration" />
                            </div>
                            <button onClick={() => { $('#mkform').slideUp(); }} className="btn btn-secondary">Close</button>
                            <button id='submitBtn' disabled={true} type='submit' className="btn btn-primary mx-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className='container my-4'>
                <h2>Our Courses</h2>
                <div className="row">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div className="col-md-4 mb-4" key={course._id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{course.title}</h5>
                                        <p className="card-text">{course.description}</p>
                                        <p className="card-text"><small className="text-muted">Duration: {course.duration} months</small></p>
                                        <button className="btn btn-sm btn-success"><i className="fa fa-edit" style={{ fontSize: "16px" }}></i></button>
                                        <button className="btn btn-sm btn-danger mx-2 my-2"><i className="fa fa-trash-o" style={{ fontSize: "16px" }}></i></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No courses available</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Courses;
