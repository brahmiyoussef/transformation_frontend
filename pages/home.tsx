import React from 'react';
import { NavbarMinimal } from '../components/Navbar/NavbarMinimal';
import Image from 'next/image';
import logo from '../footer.png';
import styles from './home.module.css'; 
import withAuth from './withAuth';
 

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <NavbarMinimal />
      </div>
      <div className={styles.container}>
        <div className={styles.centeredCard}>
          <h1 className={styles.title}>Welcome to AttijariWafa Bank!</h1>
          <Image src={logo.src} alt="Logo" width={600} height={200} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
 