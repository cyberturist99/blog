import React from 'react';

import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <span>Realworld Blog</span>
      <button className={styles['button-sign-in']}>Sign In</button>
      <button className={styles['button-sign-up']}>Sign up</button>
    </header>
  );
}

export default Header;
