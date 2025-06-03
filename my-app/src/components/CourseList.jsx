import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './my.css';
const CourseList = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [visibleCourses, setVisibleCourses] = useState(5);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const defaultCourses = useMemo(() => [
    {
      _id: "default-1",
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript.",
      imageUrl: "https://images.pexels.com/photos/7441387/pexels-photo-7441387.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      _id: "default-2",
      title: "React for Beginners",
      description: "Learn React step by step.",
      imageUrl: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      _id: "default-3",
      title: "Python for Beginners",
      description: "Learn Python programming from scratch.",
      imageUrl: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      _id: "default-4",
      title: "HTML & CSS Fundamentals",
      description: "Master the building blocks of web development.",
      imageUrl: "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      _id: "default-5",
      title: "Data Structures & Algorithms",
      description: "Strengthen your problem-solving skills.",
      imageUrl: "https://media.istockphoto.com/id/2148538959/photo/the-european-digital-services-act-concept-the-letters-dsa-surrounded-by-yellow-stars-as-in.jpg?b=1&s=612x612&w=0&k=20&c=M-74nNwva-I5ghu26J5Tp3Se81KusrwoJHM4b40In0o=",
    }
  ], []);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses');
        const fetchedCourses = response.data;
        if (fetchedCourses.length < 5) {
          const neededCourses = 5 - fetchedCourses.length;
          setCourses([...fetchedCourses, ...defaultCourses.slice(0, neededCourses)]);
        } else {
          setCourses(fetchedCourses);
        }
      } catch (error) {
        setError('Failed to load courses.');
        setCourses(defaultCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [defaultCourses]);
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCourseClick = (courseId) => {
    navigate(`/course-details/${courseId}`);
  };
  const handleShowMore = () => {
    setVisibleCourses(prev => Math.min(prev + 5, filteredCourses.length));
  };
  const handleShowLess = () => {
    setVisibleCourses(5);
  };
  return (
    <div className="course-list-container">
      {loading ? <p>Loading courses...</p> : error ? <p>{error}</p> : (
        <>
          <div className="course-cards-grid">
            {filteredCourses.slice(0, visibleCourses).map(course => (
              <div key={course._id} className="course-card" onClick={() => handleCourseClick(course._id)}>
                <img src={course.imageUrl} alt={course.title} className="course-image" style={{ cursor: 'pointer' }} />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length > visibleCourses && (
            <p className="show-more" onClick={handleShowMore}>Show More ↓</p>
          )}
          {visibleCourses > 5 && (
            <p className="show-less" onClick={handleShowLess}>Show Less ↑</p>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
