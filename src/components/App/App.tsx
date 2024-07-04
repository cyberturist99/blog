import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'antd';
import { Online, Offline } from 'react-detect-offline';

import { RootState } from '../../redux/index';
import './App.module.scss';
import Layout from '../Layout/Unlogged/Layout';
import Postlist from '../Postlist/Postlist';
import FullPage from '../FullPage/FullPage';
import RegisterForm from '../RegisterForm/RegisterForm';
import LoginForm from '../LoginForm/LoginForm';
import EditProfile from '../EditProfile/EditProfile';
import { setUser } from '../../redux/authSlice';
import CreateArticle from '../CreateArticle/CreateArticle';

const App: React.FC = () => {
  const articles = useSelector((state: RootState) => state.articles.articles);
  // const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);
  return (
    <>
      <Online>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Postlist />} />
            <Route path="articles" element={<Postlist />} />
            <Route path="articles/:slug" element={<FullPage articles={articles} />} />
            <Route path="sign-up" element={<RegisterForm />} />
            <Route path="sign-in" element={<LoginForm />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="new-article" element={<CreateArticle />} />
            <Route path="/articles/:slug/edit" element={<CreateArticle />} />
          </Route>
        </Routes>
      </Online>
      <Offline>
        <Alert message="Error" description="No internet connection" type="error" />
      </Offline>
    </>
  );
};
export default App;
