import React from 'react';
import Navbar from '../components/Navbar/NavbarMinimal';
import { UserInfoIcons } from '@/components/User/UserInfoIcons';
import withAuth from './withAuth';
 

const ProfilPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginTop: '20vh' }}>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <UserInfoIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProfilPage);
 