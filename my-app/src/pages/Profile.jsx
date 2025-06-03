import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [loading, setLoading] = useState(!authUser);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authUser) {
      axios.get('/api/users')
        .then(res => {
          const tokenUserId = localStorage.getItem('userId');
          const currentUser = res.data.find(u => u._id === tokenUserId);
          setUser(currentUser || null);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setUser(null);
          setLoading(false);
        });
    }
  }, [authUser]);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    axios.post('/api/users/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        setUser(prev => ({
          ...prev,
          profilePicture: res.data.profilePicture || preview,
        }));
        setUploading(false);
        setPreview(null);
      })
      .catch(err => {
        console.error(err);
        setError('Upload failed');
        setUploading(false);
      });
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 20 }}>Loading...</div>;

  // Default fallback data
  const defaultUser = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    profilePicture: null,  // no picture by default, so silhouette shows
  };

  const displayUser = {
    ...defaultUser,
    ...user,
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: 20, color: '#333' }}>Your Profile</h2>

      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 140,
          height: 140,
          margin: '0 auto',
          position: 'relative',
          cursor: 'pointer',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          backgroundColor: '#f0f0f0',
        }}
        onClick={openFileDialog}
        aria-label="Change profile photo"
      >
        {preview || displayUser.profilePicture ? (
          <img
            src={preview || displayUser.profilePicture}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#ccc"
            viewBox="0 0 24 24"
            width="80"
            height="80"
            style={{ borderRadius: '50%' }}
          >
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.9 1.7-9.9 5v2.2h19.8v-2.2c0-3.3-6.6-5-9.9-5z"/>
          </svg>
        )}

        {/* Camera icon always visible */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 36,
            height: 36,
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#0073b1"
            viewBox="0 0 24 24"
            width="22"
            height="22"
          >
            <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm7-3h-3.5l-1.71-2.29A1 1 0 0012.5 2h-1a1 1 0 00-.79.38L9 4H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM12 17a3 3 0 110-6 3 3 0 010 6z" />
          </svg>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && <p style={{ color: '#0073b1', marginTop: 10 }}>Uploading...</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      {(displayUser.name || displayUser.username) && (
        <h3 style={{ marginTop: 20, color: '#222' }}>
          {displayUser.name || displayUser.username}
        </h3>
      )}
      {displayUser.email && (
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{displayUser.email}</p>
      )}
    </div>
  );
};

export default Profile;
