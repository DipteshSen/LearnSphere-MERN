import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCourses from './MyCourses';

const Profile = (props) => {
    const [studentData, setStudentData] = useState(null);
    const navigate = useNavigate();



    const onChange = (e) => {
        document.getElementById('updateButton').disabled = false;
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        document.getElementById('updateButton').disabled = true;
        const { _id, name, password, address, mobile, college } = studentData;
        //API call to update student details
        fetch('http://localhost:5000/student/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id, name, password, address, mobile, college }),
        })
            .then(res => res.json())
            .then(data => {

                props.showAlert('success', 'Profile updated successfully!');
                setStudentData(data.student);
            })
            .catch(err => {
                console.error('Error:', err);
                props.showAlert('danger', 'Failed to update profile !');
            })
    }


    useEffect(() => {
        const authtoken = localStorage.getItem('authtoken');

        if (!authtoken) {
            props.showAlert('warning', 'Please Login');
            navigate('/login');
            return; // Exit the effect if not authenticated
        }

        const fetchUserData = async () => {
            try {
                // Fetching logged-in user's detail
                const userRes = await fetch('http://localhost:5000/student/getuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': authtoken,
                    },
                });
                const userData = await userRes.json();
                setStudentData(userData);



            } catch (error) {
                console.error('Error:', error);
            }

        };

        fetchUserData();







    }, [navigate, props]);

    return (
        <>
            <div className='container'>
                <form onSubmit={handleSubmit} >
                    <fieldset>
                        <legend>{studentData?.name + '\'s '}Profile Information</legend>
                        <div className="mb-3">
                            <label htmlFor="studentName" className="form-label">Student Name</label>
                            <input onChange={onChange} name='name' type="text" id="name" className="form-control" value={studentData?.name || ''} placeholder="Student Name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="studentEmail" className="form-label">Student Email</label>
                            <input onChange={onChange} name='email' disabled type="email" id="studentEmail" className="form-control" value={studentData?.email || ''} placeholder="Student Email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Passsword</label>
                            <input onChange={onChange} name='password' type="text" id="password" className="form-control" value={studentData?.password || ''} placeholder="Student Password" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="studentName" className="form-label">Address</label>
                            <input onChange={onChange} name='address' type="text" id="address" className="form-control" value={studentData?.address || ''} placeholder="Student Address" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="studentName" className="form-label">Mobile No.</label>
                            <input onChange={onChange} name='mobile' type="text" id="mobile" className="form-control" value={studentData?.mobile || ''} placeholder="Student Mobile No." />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="studentName" className="form-label">School/College</label>
                            <input onChange={onChange} name='college' type="text" id="college" className="form-control" value={studentData?.college || ''} placeholder="Enter College Name" />
                        </div>

                        <button disabled={true} className='btn btn-primary' id='updateButton'>Update</button>

                    </fieldset>
                </form>
            </div>


            <MyCourses showAlert={props.showAlert} />

        </>
    );
}

export default Profile;
