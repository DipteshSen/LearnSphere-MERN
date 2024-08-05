import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HeroSection = (props) => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const authtoken = localStorage.getItem('authtoken');
    if (!authtoken) {
      navigate('/login');
      return;
    }

    // Fetching logged in user's detail
    fetch('http://localhost:5000/student/getuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `${authtoken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStudentData(data);

      })
      .catch(error => console.error('Error:', error));

    // Fetching enrolled courses for the logged in user
    fetch('http://localhost:5000/courses/enrolledcourses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `${authtoken}`
      }
    })
      .then(res => res.json())
      .then(enrolledData => {
        setEnrolledCourses(enrolledData);
      })
      .catch(error => console.error('Error:', error));



    // Fetching courses data from database
    fetch('http://localhost:5000/courses/fetchallcourses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(courseData => {
        setCourses(courseData);
      })
      .catch(error => console.error('Error:', error));

    // eslint-disable-next-line
  }, [navigate]);

  const handleRegister = (courseId, studentId) => {
    fetch('http://localhost:5000/courses/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ student: studentId, course: courseId })
    })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        if (data.success) {
          props.showAlert('success', 'Registered successfully!');
          setEnrolledCourses([...enrolledCourses, { course: courseId }]);
        } else {
          props.showAlert('danger', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(data => data.course === courseId);
  };

  const [searchTerm, setSearchTerm] = useState('');
    // Filter students based on search term
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className='container'>
        <div className="jumbotron">
          <center><h1>Welcome {studentData ? studentData.name : 'Loading...'}</h1></center>
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
          {filteredCourses.map(course => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p className="card-text"><small className="text-muted">Duration: {course.duration} months</small></p>
                  <button
                    onClick={() => handleRegister(course._id, studentData ? studentData._id : null)}
                    className="btn btn-primary"
                    disabled={!studentData || isEnrolled(course._id)} // Disable button if studentData is not loaded or user is already enrolled
                  >
                    {isEnrolled(course._id) ? 'Enrolled' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Index = (props) => {
  return (
    <div>
      <HeroSection showAlert={props.showAlert} />
    </div>
  );
};

export default Index;
