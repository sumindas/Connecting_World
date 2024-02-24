import React, { useState } from 'react';
import './userprofile.css'; // Import your stylesheet

const UserProfileSettings = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState('');
  const [mobile,setMobile] = useState('')

  const handleSaveChanges = () => {
    console.log('Changes saved:', { fullName, username, bio, dateOfBirth, location, mobile });
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
  };

  const handleDeleteAccount = () => {
    console.log('Delete Account clicked');
  };

  return (
    <div className="user-profile-settings">
      <div style={{ textAlign: 'right' }}>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
        <button type="button" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
      <div className="user-profile-form">
        <img
          src="url_to_your_profile_image" // Replace with the actual URL or source of your profile image
          alt="Profile"
          className="profile-image"
        />
        <h2>User Profile Settings</h2>
        <form>
          <div>
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="text"
              id="dateOfBirth"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location">Mobile:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSettings;
