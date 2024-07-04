import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { marked } from 'marked';
import { Routes, Link, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Popconfirm } from 'antd';

import unlikedHeart from '../../assets/images/emptyHeart.svg';
import likedHeart from '../../assets/images/redHeart.svg';
import avaterUser from '../../assets/images/accountOwner.svg';
import { IArticle } from '../../redux/slice';
import { deleteArticle } from '../../redux/createArticleSlice';
import { AppDispatch, RootState } from '../../redux/index';
import { favoriteArticle, unfavoriteArticle } from '../../redux/markTheArticle';

import styles from './Post.module.scss';

interface PostProps {
  article: IArticle;
}

const Post: React.FC<PostProps> = ({ article }) => {
  const [isLiked, setIsLiked] = useState<boolean>(article.favorited || false);
  const [count, setCount] = useState<number>(article.favoritesCount || 0);
  const location = useLocation();
  const { username, image } = article.author;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSlugInLocalStorage, setIsSlugInLocalStorage] = useState<boolean>(false);

  useEffect(() => {
    const slugs = JSON.parse(localStorage.getItem('articleSlugs') || '[]');
    setIsSlugInLocalStorage(slugs.includes(article.slug));
  }, [article.slug]);

  useEffect(() => {
    setCount(article.favoritesCount);
  }, [article.favoritesCount]);

  const handleArticleDelete = async (articleSlug: string) => {
    await dispatch(deleteArticle(articleSlug));
    const slugs = JSON.parse(localStorage.getItem('articleSlugs') || '[]');
    const newSlugs = slugs.filter((slug: string) => slug !== articleSlug);
    localStorage.setItem('articleSlugs', JSON.stringify(newSlugs));
    navigate('/');
  };

  const truncateDescription = (overview: string, maxLength: number): string => {
    if (overview.length <= maxLength) {
      return overview;
    }
    let truncatedText: string = overview.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      truncatedText = truncatedText.slice(0, lastSpaceIndex);
    }
    return `${truncatedText}...`;
  };

  const formattedDate = format(new Date(article.createdAt), 'MMMM d, yyyy');
  const isPostPage = location.pathname === `/articles/${article.slug}`;
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const markTheArticle = async () => {
    if (isLoggedIn && !isLiked) {
      setIsLiked(!isLiked);
      await dispatch(favoriteArticle(article.slug));
      setCount(count + 1); // увеличиваем счетчик на 1
    } else if (isLoggedIn && isLiked) {
      setIsLiked(!isLiked);
      await dispatch(unfavoriteArticle(article.slug));
      setCount(count - 1); // уменьшаем счетчик на 1
    } else {
      return null;
    }
  };

  return (
    <>
      <li className={styles.post}>
        <div className={styles['post__header']}>
          <span className={styles['like-container']}>
            <Link to={`/articles/${article.slug}`} className={styles['post__title']}>
              {article.title ? truncateDescription(article.title, 50) : null}
            </Link>
            <img
              className={styles.like}
              onClick={markTheArticle}
              src={isLiked ? likedHeart : unlikedHeart}
              alt="likes"
            />
            <span className={styles['likes-count']}>{count}</span>
          </span>
          <div className={styles['account-owner-username-post-date']}>
            <div className={styles['account-container']}>
              <span className={styles['account-owner-username']}>{username}</span>
              <span className={styles['post-date']}>{formattedDate}</span>
            </div>

            <img
              className={styles.avatar}
              src={image || avaterUser}
              alt="avatar"
              width="46"
              height="46"
            />
            {isSlugInLocalStorage && isPostPage && (
              <div className={styles['buttons']}>
                <Popconfirm
                  title="Are you sure to delete this article?"
                  okText="Yes"
                  cancelText="No"
                  placement="rightTop"
                  onConfirm={() => handleArticleDelete(article.slug)}
                >
                  <button className={styles['delete-btn']} type="button">
                    Delete
                  </button>
                </Popconfirm>
                <Link to={'edit'} className={styles['edit-btn']}>
                  Edit
                </Link>
              </div>
            )}
          </div>
        </div>

        <ul className={styles['tag-list']}>
          {article.tagList.map((tag: string, i: number) =>
            tag ? (
              <li key={i} className={styles['tag-btn']}>
                {tag}
              </li>
            ) : null
          )}
        </ul>

        {isPostPage ? (
          <>
            <div className={styles['post__text']}>
              {article.description ? article.description : null}
            </div>
            <div
              className={styles['post__body-text']}
              dangerouslySetInnerHTML={{ __html: article.body ? marked(article.body) : '' }}
            />
          </>
        ) : (
          <div className={styles['post__text']}>
            {article.description ? truncateDescription(article.description, 230) : null}
          </div>
        )}
      </li>

      <Routes>
        <Route path={`${article.slug}`}></Route>
      </Routes>
    </>
  );
};

export default Post;
