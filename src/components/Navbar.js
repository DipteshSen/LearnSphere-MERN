import React,{useRef} from 'react';
import {Link,useNavigate} from 'react-router-dom'

const Navbar = () => {

  const closeNav = useRef(null);
  const navigate = useNavigate();

  const handleClick=()=>{
    setTimeout(()=>{
      closeNav.current.click()
    },500)
  }

  const handleLogOut=()=>{
    localStorage.removeItem('authtoken');
    navigate('/login');
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">LearnSphere</Link>
        <button ref={closeNav} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link onClick={handleClick} className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            {localStorage.getItem('authtoken') && <li className="nav-item">
              <Link onClick={handleClick} className="nav-link active" aria-current="page" to="/profile">My Profile</Link>
            </li>}
            
          </ul>
          <form className="d-flex">
          {!localStorage.getItem('authtoken') ?
            <form className="d-flex">
              <Link onClick={handleClick} className="btn btn-outline-success" to='/login' type="button">Log in</Link>
              <Link onClick={handleClick} className="btn btn-outline-primary mx-3" to='/signup' type="submit">Sign Up</Link>
            </form>:<button onClick={()=>{handleLogOut();handleClick();}} className="btn btn-outline-secondary" >Log Out</button>}
          </form>

        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;