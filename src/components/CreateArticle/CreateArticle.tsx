import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { AppDispatch } from '../../redux/index';
import { createArticle, updateArticle } from '../../redux/createArticleSlice';

import styles from './CreateArticle.module.scss';

const CreateArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState<Iarticle>();
  const [tags, setTags] = useState(['']);

  interface Iarticle {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  }

  const slug = location.pathname.split('/')[2];
  const getArticle = async (slug: string) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`);
      const data = await response.json();
      setArticle({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
        tagList: data.article.tagList
      });

      setTags(data.article.tagList || ['']);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (slug) {
      getArticle(slug);
    }
  }, [slug]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Iarticle>({
    defaultValues: {
      title: article?.title,
      description: article?.description,
      body: article?.body,
      tagList: article?.tagList
    }
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList
      });
    }
  }, [article]);

  const handleAddTag = () => {
    if (tags[tags.length - 1]) {
      setTags([...tags, '']);
    }
  };

  const handleDeleteTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTags = [...tags];
    newTags[index] = e.target.value;
    setTags(newTags);
  };

  const submit: SubmitHandler<Iarticle> = async (data) => {
    if (slug) {
      const result = await dispatch(updateArticle({ slug, article: data }));
      unwrapResult(result);
    } else {
      const result = await dispatch(createArticle(data));
      unwrapResult(result);
    }
    navigate('/articles');
  };

  const error: SubmitErrorHandler<Iarticle> = (data) => {
    console.log(data);
  };
  const isEditPage = location.pathname.match(/\/articles\/\w+-\w+\/edit$/);

  const createArticleTagList = (
    <>
      {tags.map((tag, index) => (
        <li className={styles['tag-list__item']} key={index}>
          <input
            className={styles['tag-input']}
            type="text"
            placeholder="Tag"
            value={tag}
            {...register(`tagList.${index}`, {
              onChange: (e) => handleTagChange(e, index)
            })}
          />{' '}
          {tags.length > 1 && (
            <button
              className={styles['delete-tag-btn']}
              type="button"
              onClick={() => handleDeleteTag(index)}
            >
              Delete
            </button>
          )}{' '}
          {tags.length - 1 === index && (
            <button className={styles['add-tag-btn']} type="button" onClick={handleAddTag}>
              Add
            </button>
          )}
        </li>
      ))}
    </>
  );

  const handleEditTagChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (article && article.tagList) {
      const newTagList = [...article.tagList];
      newTagList[index] = e.target.value;
      setArticle((prevArticle) => {
        if (prevArticle) {
          return { ...prevArticle, tagList: newTagList };
        }
        return undefined;
      });
    }
  };

  const handleEditDeleteTag = (indexToRemove: number) => {
    if (article && article.tagList) {
      const newTagList = [...article.tagList];
      newTagList.splice(indexToRemove, 1);
      setArticle((prevArticle) => {
        if (prevArticle) {
          return { ...prevArticle, tagList: newTagList };
        }
        return undefined;
      });
    }
  };

  const handleEditAddTag = () => {
    if (article && article.tagList && article.tagList[article.tagList.length - 1]) {
      setArticle((prevArticle) => {
        if (prevArticle && prevArticle.tagList) {
          return { ...prevArticle, tagList: [...prevArticle.tagList, ''] };
        }
        return undefined;
      });
    }
  };

  const EditArticleTagList = (
    <>
      {article?.tagList &&
        article.tagList.map((tag, index) => (
          <li className={styles['tag-list__item']} key={index}>
            <input
              className={styles['tag-input']}
              type="text"
              placeholder="Tag"
              defaultValue={tag}
              {...register(`tagList.${index}`, {
                onChange: (e) => handleEditTagChange(e, index)
              })}
            />{' '}
            {article?.tagList &&
              article.tagList.length > 1 &&
              index !== article.tagList.length - 1 && (
                <button
                  className={styles['delete-tag-btn']}
                  type="button"
                  onClick={() => handleEditDeleteTag(index)}
                >
                  Delete
                </button>
              )}{' '}
            {article?.tagList && index === article.tagList.length - 1 && (
              <button className={styles['add-tag-btn']} type="button" onClick={handleEditAddTag}>
                Add
              </button>
            )}
          </li>
        ))}
    </>
  );

  return (
    <form onSubmit={handleSubmit(submit, error)} className={styles['create-article-form']}>
      <h3 className={styles.title}>{isEditPage ? 'Edit article' : 'Create new article'}</h3>

      <label className={styles.label}>
        <span className={styles['label__title']}>Title</span>
        <input
          className={styles['label__input']}
          type="text"
          placeholder="Title"
          {...register('title', { required: true, validate: (value) => value.trim() !== '' })}
          style={{ borderColor: errors.title ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)' }}
        />
        {errors['title'] && <span className={styles['error-message']}>title is required</span>}
      </label>

      <label className={styles.label}>
        <span className={styles['label__title']}>Short description</span>
        <input
          className={styles['label__input']}
          type="text"
          placeholder="Title"
          {...register('description', { required: true, validate: (value) => value.trim() !== '' })}
          style={{
            borderColor: errors.description ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
          }}
        />
        {errors['description'] && (
          <span className={styles['error-message']}>description is required</span>
        )}
      </label>

      <label className={styles.label}>
        <span className={styles['label__title']}>Text</span>
        <textarea
          className={styles['body-input']}
          placeholder="Text"
          {...register('body', { required: true, validate: (value) => value.trim() !== '' })}
          style={{
            borderColor: errors.body ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
          }}
        />
        {errors['body'] && <span className={styles['error-message']}>text is required</span>}
      </label>

      <label className={styles.label}>
        <span className={styles['label__title']}>Tags</span>
        <div>
          <ul className={styles['tag-list']}>{slug ? EditArticleTagList : createArticleTagList}</ul>
          <button className={styles['send-btn']}>Send</button>
        </div>
      </label>
    </form>
  );
};

export default CreateArticle;
