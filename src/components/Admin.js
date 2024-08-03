import React from 'react'
import { useNavigate } from 'react-router-dom'
const Admin = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');
  
  if(!adminToken){
    navigate('/adminlogin', { replace: true });
    return null;  // Return early to avoid rendering the children below.  This prevents potential bugs.  If you want to render something else, you can add it here.  For example, a loading spinner or a message.  Just make sure to add it after the return statement.  The return statement should always be the last thing in a functional component.  If you have any conditional logic or other code that needs to run before the render, you should do it before the return statement.  If you need to run some code after the render, you can use useEffect.  If you need to run some code when the component mounts or updates, you can use the useEffect hook.  If you need to run some code when the component unmounts, you can use the useEffect hook with an empty dependency array ([]).  If you need to run some code when the component receives new props, you can use the useEffect hook with
  }


  return (
    <div className='container-fluid'>
      <h1>Admin Dashboard</h1>

    </div>
  )
}

export default Admin
