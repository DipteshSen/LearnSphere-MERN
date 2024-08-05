import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';

const Courses = (props) => {

    //States
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", duration: 1 });
    const modalBtn = useRef(null);
    const closeModal = useRef(null);
    const [editData, setEditData] = useState({});

    //=================================================================

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
    }, [props]);
    //================================================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        document.getElementById('submitBtn').disabled = true;
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

    //Submit Modal================================================================================================================

    const submitModal = async (e) => {
        e.preventDefault();
        const { id, etitle, edescription, eduration } = editData;

        await fetch('http://localhost:5000/courses/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id, title: etitle, description: edescription, duration: eduration })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    props.showAlert('success', 'Course updated successfully');
                    setCourses(courses.map(course => course._id === editData.id ? data.course : course));
                    setEditData({});
                    closeModal.current.click();

                } else {
                    props.showAlert('danger', 'Failed to update course');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    //============================================================================
    const onChange = (e) => {
        document.getElementById('submitBtn').disabled = false;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleModalFormChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    //Open Modal================================================================

    const openEditModal = async (courseId) => {
        await fetch('http://localhost:5000/courses/fetchcourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: courseId }),
        })
            .then(res => res.json())
            .then(data => {
                setEditData({ id: data._id, etitle: data.title, edescription: data.description, eduration: data.duration });
            })
            .catch(err => console.log(err));

        modalBtn.current.click();
    };

    //Delete Course================================================================

    const deleteCourse = (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            fetch(`http://localhost:5000/courses/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: courseId })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        props.showAlert('success', 'Course deleted successfully');
                        setCourses(courses.filter(course => course._id !== courseId));
                    } else {
                        props.showAlert('danger', 'Failed to delete course');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    // Filter students based on search term
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <button ref={modalBtn} style={{ display: "none" }} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Course</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={submitModal}>
                                <div className="mb-3 my-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input value={editData.etitle} onChange={handleModalFormChange} type="text" className="form-control" id="etitle" name="etitle" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input value={editData.edescription} onChange={handleModalFormChange} type="text" className="form-control" id="edescription" name="edescription" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="eduration" className="form-label">Duration</label>
                                    <input value={editData.eduration} onChange={handleModalFormChange} type="text" className="form-control" id="eduration" name="eduration" />
                                </div>
                                <div className="modal-footer">
                                    <button ref={closeModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

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
                            <button onClick={(e) => { e.preventDefault(); $('#mkform').slideUp(); }} className="btn btn-secondary">Close</button>
                            <button id='submitBtn' disabled={true} type='submit' className="btn btn-primary mx-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className='container my-4'>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <h2>Our Courses</h2>
                <div className="row">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, index) => (
                            <div className="col-md-4 mb-4" key={course?._id || index}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{course?.title || "Unknown Title"}</h5>
                                        <p className="card-text">{course?.description || "Unknown Description"}</p>
                                        <p className="card-text"><small className="text-muted">Duration: {course?.duration || "Unknown Duration"} months</small></p>
                                        <button onClick={() => { openEditModal(course?._id) }} className="btn btn-sm btn-success"><i className="fa fa-edit" style={{ fontSize: "16px" }}></i></button>
                                        <button onClick={() => { deleteCourse(course?._id) }} className="btn btn-sm btn-danger mx-2 my-2"><i className="fa fa-trash-o" style={{ fontSize: "16px" }}></i></button>
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
