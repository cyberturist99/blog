import React, { useState } from 'react';

import unlikedHeart from '../../images/emptyHeart.svg';
import likedHeart from '../../images/redHeart.svg';
import avaterUser from '../../images/accountOwner.svg';

import styles from './Post.module.scss';

function Post() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <li className={styles.post}>
      <h5 className={styles['post__title']}>Some article title</h5>

      <span className={styles['like-container']}>
        <img
          className={styles.like}
          onClick={() => setIsLiked(!isLiked)}
          src={isLiked ? likedHeart : unlikedHeart}
          alt="likes"
        />
        <span className={styles['likes-count']}>12</span>
      </span>
      <div className={styles['account-owner-username-post-date']}>
        <span className={styles['account-owner-username']}>John Doe</span>
        <span className={styles['post-date']}>March 5, 2020</span>
        <img className={styles.avatar} src={avaterUser} alt="avatar" width="46" height="46" />
      </div>

      <button className={styles['tag-btn']}>Tag</button>
      <div className={styles['post__text']}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </li>
  );
}

export default Post;
