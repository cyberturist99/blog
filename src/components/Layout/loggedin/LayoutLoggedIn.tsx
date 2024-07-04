import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import avatar from '../../../assets/images/accountOwner.svg';
import { AppDispatch, RootState } from '../../../redux/index';
import { logoutUser } from '../../../redux/authSlice';

import styles from './LayoutLoggedIn.module.scss';

const LayoutLoggedIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((state: RootState) => state.user.user?.username);
  const image = useSelector((state: RootState) => state.user.user?.image);

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <header className={styles.header}>
        <Link className={styles['header-title']} to={'/'}>
          Realworld Blog
        </Link>
        {/* create article */}
        <Link to={'new-article'} className={styles['button-create-article']}>
          Create article
        </Link>
        {/* edit profile link */}
        <Link to={'profile'} className={styles['edit-profile']}>
          <span className={styles.username}>{username ? username : ''}</span>
          <img src={image ? image : avatar} alt="edit profile" className={styles.image} />
        </Link>
        {/* log out user */}
        <Link to={'/'} onClick={logout} className={styles['button-logout']}>
          Log out
        </Link>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
export default LayoutLoggedIn;
