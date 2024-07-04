import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, AppDispatch } from '../../redux/index';
import { updateUser } from '../../redux/authSlice';

import styles from './EditProfile.module.scss';

const EditProfile: React.FC = () => {
  interface editProfile {
    username: string;
    email: string;
    password: string;
    image: string;
  }

  const username = useSelector((state: RootState) => state.user.user?.username);
  const email = useSelector((state: RootState) => state.user.user?.email);
  const dispatch = useDispatch<AppDispatch>();

  const submit: SubmitHandler<editProfile> = async (data) => {
    await dispatch(updateUser(data));
  };

  const error: SubmitErrorHandler<editProfile> = (data) => {
    console.log('error', data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<editProfile>({
    defaultValues: {
      username: username,
      email: email
    }
  });

  const isEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };
  const isPassword = (password: string) => {
    if (password.length >= 6 && password.length <= 40) {
      return true;
    }
    return false;
  };

  const isUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit, error)} className={styles['edit-profile-form']}>
        <h3 className={styles.title}>Edit profile</h3>
        <label className={styles.label}>
          <span className={styles['label__text']}>Username</span>
          <input
            className={styles['label__input']}
            type="text"
            {...register('username', { required: true })}
            style={{
              borderColor: errors.username ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
            }}
          />
          {errors.username && errors.username.type === 'required' && (
            <span className={styles['error-message']}>Username is required</span>
          )}
        </label>
        <label className={styles.label}>
          <span className={styles['label__text']}>Email address</span>
          <input
            className={styles['label__input']}
            type="email"
            {...register('email', { required: true, validate: isEmail })}
            style={{
              borderColor: errors.email ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
            }}
          />
          {errors.email && errors.email.type === 'required' && (
            <span className={styles['error-message']}>Email is required</span>
          )}
          {errors.email && errors.email.type === 'validate' && (
            <span className={styles['error-message']}>Email is invalid</span>
          )}
        </label>
        <label className={styles.label}>
          <span className={styles['label__text']}>New password</span>
          <input
            className={styles['label__input']}
            type="password"
            {...register('password', { required: true, validate: isPassword })}
            style={{
              borderColor: errors.password ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
            }}
          />
          {errors.password && errors.password.type === 'validate' && (
            <span className={styles['error-message']}>
              Password must be between 6 and 40 characters.
            </span>
          )}
          {errors.password && errors.password.type === 'required' && (
            <span className={styles['error-message']}>Password is required</span>
          )}
        </label>
        <label className={styles.label}>
          <span className={styles['label__text']}>Avatar image (url)</span>
          <input
            className={styles['label__input']}
            type="url"
            {...register('image', { validate: (value) => value === '' || isUrl(value) })}
            style={{
              borderColor: errors.image ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
            }}
          />
          {errors.image && errors.image.type === 'validate' && (
            <span className={styles['error-message']}>Url must be correct.</span>
          )}
        </label>
        <button className={styles['button-submit']}>Save</button>
      </form>
    </>
  );
};

export default EditProfile;
