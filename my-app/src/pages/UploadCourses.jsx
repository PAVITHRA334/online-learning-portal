import { useState, useEffect } from "react";
import axios from "axios";
import "./UploadCourses.css";
const UploadCourses = () => {
  const [courseId, setCourseId] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseImageUrl, setCourseImageUrl] = useState("");
  const [modules, setModules] = useState([
    { title: "", units: [{ title: "", videoUrl: "", pdfUrl: "" }] }
  ]);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetchCourses();
  }, []);
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/courses");
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        console.error("Unexpected API response:", response.data);
        setCourses([]); 
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); 
    }
  };
  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`);
      alert("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  const editCourse = (course) => {
    setCourseId(course._id);
    setCourseName(course.title);
    setCourseDescription(course.description);
    setCoursePrice(course.price);
    setCourseImageUrl(course.imageUrl);
    setModules(course.modules);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", courseName);
    formData.append("description", courseDescription);
    formData.append("price", coursePrice);
    formData.append("imageUrl", courseImageUrl);
    formData.append("modules", JSON.stringify(modules));
    try {
      if (courseId) {
        await axios.put(`http://localhost:5000/courses/${courseId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post("http://localhost:5000/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      alert(`Course "${courseName}" has been ${courseId ? "updated" : "uploaded"}!`);
      setCourseId(null);
      setCourseName("");
      setCourseDescription("");
      setCoursePrice("");
      setCourseImageUrl("");
      setModules([{ title: "", units: [{ title: "", videoUrl: "", pdfUrl: "" }] }]);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };
  return (
    <div className="upload-container">
      <h2>{courseId ? "Edit Course" : "Upload New Course"}</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name:</label>
          <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Course Description:</label>
          <input type="text" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Course Price:</label>
          <input type="text" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Course Image URL:</label>
          <input type="text" value={courseImageUrl} onChange={(e) => setCourseImageUrl(e.target.value)} required />
        </div>
         <div></div>
        <h3>Course Modules & Lessons</h3>
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="module-section">
            <input
              type="text"
              placeholder="Module Title"
              value={module.title}
              onChange={(e) => {
                const updatedModules = [...modules];
                updatedModules[moduleIndex].title = e.target.value;
                setModules(updatedModules);
              }}
              required
            />
            {module.units.map((unit, unitIndex) => (
              <div key={unitIndex}>
                <input
                  type="text"
                  placeholder="Lesson Name"
                  value={unit.title}
                  onChange={(e) => {
                    const updatedModules = [...modules];
                    updatedModules[moduleIndex].units[unitIndex].title = e.target.value;
                    setModules(updatedModules);
                  }}
                  required
                />
                <div className="form-group">
                  <label>Video URL:</label>
                  <input
                    type="text"
                    placeholder="Enter Video URL"
                    value={unit.videoUrl}
                    onChange={(e) => {
                      const updatedModules = [...modules];
                      updatedModules[moduleIndex].units[unitIndex].videoUrl = e.target.value;
                      setModules(updatedModules);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>PDF URL:</label>
                  <input
                    type="text"
                    placeholder="Enter PDF URL"
                    value={unit.pdfUrl}
                    onChange={(e) => {
                      const updatedModules = [...modules];
                      updatedModules[moduleIndex].units[unitIndex].pdfUrl = e.target.value;
                      setModules(updatedModules);
                    }} 
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => {
              const updatedModules = [...modules];
              updatedModules[moduleIndex].units.push({ title: "", videoUrl: "", pdfUrl: "" });
              setModules(updatedModules);
            }}>
              Add Lesson
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setModules([...modules, { title: "", units: [{ title: "", videoUrl: "", pdfUrl: "" }] }])}>
          Add Module
        </button>
        <button type="submit">{courseId ? "Update Course" : "Upload Course"}</button>
      </form>
      <h2>Uploaded Courses</h2>
      <ul style={{ listStyle: "none", padding: "0" }}>
  {courses.length > 0 ? (
    courses.map((course) => (
      <li 
        key={course._id} 
        style={{ 
          padding: "12px", 
          marginBottom: "10px", 
          border: "1px solid #ddd", 
          borderRadius: "8px",
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f9f9f9"
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: "500" }}>
          {course.title} - <span style={{ color: "#4CAF50" }}>${course.price}</span>
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => editCourse(course)}
            style={{
              padding: "8px 14px",
              fontSize: "14px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              transition: "background-color 0.3s ease-in-out"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Edit
          </button>
          <button 
            onClick={() => deleteCourse(course._id)}
            style={{
              padding: "8px 14px",
              fontSize: "14px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              transition: "background-color 0.3s ease-in-out"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            Delete
          </button>
        </div>
      </li>
    ))
  ) : (
    <p style={{ fontSize: "16px", fontWeight: "500", color: "#666" }}>No courses available.</p>
  )}
</ul>
    </div>
  );
};

export default UploadCourses; 