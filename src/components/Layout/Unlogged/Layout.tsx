import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/index';
import LayoutLoggedIn from '../loggedin/LayoutLoggedIn';

import styles from './Layout.module.scss';

const Layout: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const layoutUnlogged = (
    <>
      <header className={styles.header}>
        <Link className={styles['header-title']} to={'/'}>
          Realworld Blog
        </Link>
        <Link to="sign-in" className={styles['button-sign-in']}>
          Sign In
        </Link>
        <Link to="sign-up" className={styles['button-sign-up']}>
          Sign Up
        </Link>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );

  return isLoggedIn ? <LayoutLoggedIn /> : layoutUnlogged;
};

export default Layout;
