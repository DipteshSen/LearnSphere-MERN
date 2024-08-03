import { useState } from "react"

import {useNavigate} from 'react-router-dom'

const AdminLogin = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", mobile: "", address: "", password: "" })
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      //console.log(credentials);
  
      //API CALL to Sign Up
      fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.success) {
            props.showAlert('success','Login Successful !');
            setCredentials({ email: "", password: "" });
            localStorage.setItem('adminToken', data.authtoken);
            navigate('/admin');
  
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
        <h2>Welcome Back Admin!</h2>
        <p>Please login to continue.</p>
        <form onSubmit={handleSubmit}>
        <h1><strong>Log In</strong></h1>
          <div className="mb-3 my-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input onChange={onChange} type="email" className="form-control" id="email" name="email" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input onChange={onChange} type="password" className="form-control" id="password" name="password" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
  
  export default AdminLogin
  
