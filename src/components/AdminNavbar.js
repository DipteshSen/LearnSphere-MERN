import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const AdminNavbar = () => {

  const closeNav = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      closeNav.current.click()
    }, 500)
  }


  const handleLogOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminlogin');
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">Admin Panel</Link>
          <button ref={closeNav} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link onClick={handleClick} className="nav-link active" aria-current="page" to="/admin">Home</Link>
              </li>
              <li className="nav-item">
                <Link onClick={handleClick} className="nav-link active" aria-current="page" to="/admin/courses">Courses</Link>
              </li>
              <li className="nav-item">
                <Link onClick={handleClick} className="nav-link active" aria-current="page" to="/admin/changepassword">Change Password</Link>
              </li>


            </ul>
            <form className="d-flex">
              {!localStorage.getItem('adminToken') ?
                <form className="d-flex">
                  <Link onClick={handleClick} className="btn btn-outline-success" to='/login' type="button">Log in</Link>
                </form> : <button onClick={() => { handleLogOut(); handleClick(); }} className="btn btn-outline-secondary" >Log Out</button>}
            </form>

          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;