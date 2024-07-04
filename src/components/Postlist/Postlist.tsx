import { useEffect, useState } from 'react';
import { Pagination, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { IArticle, fetchArticles } from '../../redux/slice';
import { AppDispatch, RootState } from '../../redux/index';
import Post from '../Post/Post';

import styles from './Postlist.module.scss';

const Postlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchArticles(page)).then(() => {
      setLoading(false);
    });
  }, [page]);

  const changePage = (pageNumber: number) => {
    const newPage = (pageNumber - 1) * 5;
    setPage(newPage);
  };

  const articles: IArticle[] = useSelector((state: RootState) => state.articles.articles);

  if (isLoading) {
    return <Spin size="large" className={styles.spinner} />;
  }

  return articles ? (
    <>
      <ul className={styles['Post-list']}>
        {articles.map((article) => {
          return <Post key={article.slug} article={article} />;
        })}
      </ul>
      <Pagination className={styles.pagination} total={50} onChange={changePage} />
    </>
  ) : null;
};

export default Postlist;
