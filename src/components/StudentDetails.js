import React, { useState, useEffect, useRef } from "react";

const StudentDetails = (props) => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const openModal = useRef(null);
    const closeModal = useRef(null);
    const [editData, setEditData] = useState({});
    var count = 0;

    useEffect(() => {
        //fetch all students data
        fetch('http://localhost:5000/admin/getallstudents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                //props.showAlert('success', data.message);
                setStudents(data.students);
                //console.log(data.students);
            })
            .catch(error => {
                //props.showAlert('error', error.message);
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const deleteStudent = async (sid) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            //console.log(sid + ' getting deleted');
            fetch('http://localhost:5000/student/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: sid })
            })
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    if (data.success) {
                        props.showAlert('success', 'Student deleted successfully');
                        setStudents(students.filter(student => student._id !== sid));
                    } else {
                        props.showAlert('danger', data.message);
                    }
                })
        }
    }

    //Submit Modal================================================================================================================

    const submitModal = async (e) => {
        e.preventDefault();
        const { id, ename, emobile, eaddress, ecollege } = editData;

        await fetch('http://localhost:5000/student/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id, name: ename, mobile: emobile, address: eaddress, college: ecollege })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {

                    props.showAlert('success', 'Student account updated successfully');
                    setStudents(students.map(student => student._id === id ? { ...student, name: ename, mobile: emobile, address: eaddress, college: ecollege } : student));
                    closeModal.current.click();

                } else {
                    props.showAlert('danger', 'Failed to update course');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    //============================================================================

    const handleModalFormChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    //Open Modal================================================================

    const openEditModal = async (sid) => {
        fetch('http://localhost:5000/student/fetchstudentbyid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: sid }),
        })
            .then(res => res.json())
            .then(data => {
                setEditData({ id: data.student._id, ename: data.student.name, emobile: data.student.mobile, eaddress: data.student.address, ecollege: data.student.college });
            })
            .catch(err => console.log(err));

        openModal.current.click();
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile.includes(searchTerm) ||
        student.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.college.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <button ref={openModal} style={{ display: "none" }} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit {editData.ename}'s Info</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={submitModal}>
                                <div className="mb-3 my-3">
                                    <label htmlFor="ename" className="form-label">Name</label>
                                    <input value={editData.ename} onChange={handleModalFormChange} type="text" className="form-control" id="ename" name="ename" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="emobile" className="form-label">Mobile</label>
                                    <input value={editData.emobile} onChange={handleModalFormChange} type="text" className="form-control" id="emobile" name="emobile" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="eaddress" className="form-label">Address</label>
                                    <input value={editData.eaddress} onChange={handleModalFormChange} type="text" className="form-control" id="eaddress" name="eaddress" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ecollege" className="form-label">College</label>
                                    <input value={editData.ecollege} onChange={handleModalFormChange} type="text" className="form-control" id="ecollege" name="ecollege" />
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

            <div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Mobile</th>
                                <th scope="col">Address</th>
                                <th scope="col">College</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student._id}>
                                    <th scope="row">{++count}</th>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.mobile}</td>
                                    <td>{student.address}</td>
                                    <td>{student.college}</td>
                                    <td>
                                        <button onClick={() => { openEditModal(student._id) }} className="btn btn-sm btn-success"><i className="fa fa-edit" style={{ fontSize: "16px" }}></i></button>
                                        <button onClick={() => { deleteStudent(student._id) }} className="btn btn-sm btn-danger mx-2 my-2"><i className="fa fa-trash-o" style={{ fontSize: "16px" }}></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default StudentDetails;
