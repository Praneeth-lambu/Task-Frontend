import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const user = useSelector(state => state.auth.user);
    console.log(user,"userprofile.js")
  return (
    <div className="user-profile" style={{color:"black",paddingRight: "10px"}}>
      {user && (
        <span>Welcome, {user.name}!</span>
      ) }
    </div>
  );
};

export default UserProfile;
