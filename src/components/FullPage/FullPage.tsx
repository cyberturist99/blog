import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Spin } from 'antd';

import { IArticle } from '../../redux/slice';
import Post from '../Post/Post';

import styles from './Fullpage.module.scss';

interface PostPageProps {
  articles: IArticle[];
}

const FullPage: React.FC<PostPageProps> = ({ articles }) => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<IArticle | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

  useEffect(() => {
    setisLoading(true);
    const currentPost = articles.find((article) => article.slug === slug);
    setPost(currentPost || null);
    setisLoading(false);
  }, [slug, articles]);

  if (isLoading) {
    return <Spin size="large" className={styles.spinner} />;
  }
  if (!post) {
    return <Alert message="Warning" description="Page not found" type="warning" showIcon />;
  }

  return <Post article={post} />;
};

export default FullPage;
