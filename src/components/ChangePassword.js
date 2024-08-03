import { useState } from "react"

import {useNavigate} from 'react-router-dom'

const ChangePassword = (props) => {
    const [credentials, setCredentials] = useState({ oldpassword: "", newpassword: "", confirmpassword: ""})
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      //console.log(credentials);
      const adminToken = localStorage.getItem('adminToken');
  
      //API CALL to Sign Up
      fetch('http://localhost:5000/admin/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token':`${adminToken}`
        },
        body: JSON.stringify(credentials)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.success) {
            props.showAlert('success','Password changed Successfully !');
            setCredentials({ oldpassword: "", newpassword: "", confirmpassword: ""});
  
          } else {
            props.showAlert('danger',data.message);
          }
        })
        .catch(error => console.error('Error:', error));
  
  
    }
  
  
    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
  
  
    return (
      <div className='container my-3'>
        
        <form onSubmit={handleSubmit}>
        <h1><strong>Change Password</strong></h1>
          <div className="mb-3 my-3">
            <label htmlFor="oldpassword" className="form-label">Old Password</label>
            <input onChange={onChange} type="text" className="form-control" id="oldpassword" name="oldpassword" />
            
          </div>
          <div className="mb-3">
            <label htmlFor="newpassword" className="form-label">New Password</label>
            <input onChange={onChange} type="password" className="form-control" id="newpassword" name="newpassword" />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmpassword" className="form-label">Confirm new Password</label>
            <input onChange={onChange} type="password" className="form-control" id="confirmpassword" name="confirmpassword" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
  
  export default ChangePassword
  
