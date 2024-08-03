import React, { useState, useEffect } from "react";

const StudentDetails = (props) => {
    const [students, setStudents] = useState([]);
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

    return (
        <div>
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
                        {students.map(student => (
                            <tr key={student._id}>
                                <th scope="row">{++count}</th>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.mobile}</td>
                                <td>{student.address}</td>
                                <td>{student.college}</td>
                                <td>
                                    <button className="btn btn-sm btn-success"><i classname="fa fa-edit" style={{fontSize:"16px"}}></i></button>
                                    <button className="btn btn-sm btn-danger mx-2 my-2"><i classname="fa fa-trash-o" style={{fontSize:"16px"}}></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentDetails;
