import React, { useEffect } from 'react';
import { Pagination } from 'antd';

import Post from '../Post/Post';
import token from '../../api/token';

import styles from './Postlist.module.scss';

function Postlist() {
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const response = await fetch('https://blog.kata.academy/api/articles', {
      method: 'GET',
      headers: { Authorization: `Token ${token}` }
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <ul className={styles['Post-list']}>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </ul>
      <Pagination className={styles.pagination} total={50} />
    </>
  );
}

export default Postlist;
