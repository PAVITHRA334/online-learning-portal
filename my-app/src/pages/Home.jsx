import React, { useState } from 'react';
import CourseList from '../components/CourseList';
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [otherQuery, setOtherQuery] = useState(''); 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value !== 'Other') {
      setOtherQuery(''); 
    }
  };
  const handleOtherQueryChange = (e) => {
    setOtherQuery(e.target.value);
  };
  const handleBackToSelect = () => {
    setSearchQuery(''); 
    setOtherQuery('');  
  };
  return (
    <div>
      <div style={{ textAlign: 'center', margin: '20px' }}>
        {searchQuery !== 'Other' ? (
          <select
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              marginBottom: '20px',
            }}
          >
            <option value="">Select a Course</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="Javascript">JavaScript</option>
            <option value="AI">AI</option>
            <option value="C">C</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="React">React</option>
            <option value="NodeJS">NodeJS</option>
            <option value="Express">Express</option>
            <option value="Database">Database</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Please specify..."
              value={otherQuery}
              onChange={handleOtherQueryChange}
              style={{
                padding: '10px',
                width: '300px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginBottom: '10px',
              }}
            />
            <div style={{ marginTop: '10px' }}>
              <p
                onClick={handleBackToSelect}
                style={{
                  cursor: 'pointer',
                  color: '#007BFF',
                  textDecoration: 'underline',
                  marginBottom: '10px',
                }}
              >
                Back to Course Selection
              </p>
            </div>
          </div>
        )}
      </div>
      <CourseList searchQuery={searchQuery === 'Other' ? otherQuery : searchQuery} />
    </div>
  );
};
export default Home;
