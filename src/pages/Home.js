import React from 'react';

const Home = () => {
  const headingStyle = {
    textAlign: 'center', // Center text horizontally
    marginTop: '20%', // Push the heading down from the top
    fontSize: '2.5rem', // Larger font size
    color: 'black', // Dark gray color for the text
    fontFamily: 'Arial, sans-serif', // Font family
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={headingStyle}>
        Welcome to Task Management Application
      </h1>
    </div>
  );
}

export default Home;
