import React from 'react';
import {NavbarMinimal} from '../components/Navbar/NavbarMinimal';


const Dashboard = () => {
  
  const handleFileDrop = (files: File[]) => {
    console.log('Files dropped:', files);
    
  };

  return (
    <div>
      <NavbarMinimal />  
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h1>Welcome to the Dashboard!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
