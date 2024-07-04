import { Link, useNavigate } from 'react-router-dom';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../../redux/index';
import { loginUser } from '../../redux/authSlice';

import styles from './LoginForm.module.scss';

interface LogForm {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LogForm>();

  const submit: SubmitHandler<LogForm> = async (data) => {
    const { email, password } = data;
    const result = await dispatch(loginUser({ email, password }));
    unwrapResult(result);
    navigate('/articles');
  };

  const error: SubmitErrorHandler<LogForm> = (data) => {
    console.log('error', data);
  };

  const isEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const serverErrors = useSelector((state: RootState) => state.user.error);

  return (
    <form onSubmit={handleSubmit(submit, error)} className={styles['login-form']}>
      <h3 className={styles['login-form__title']}>Sign In</h3>

      {/* email*/}

      <label className={styles['label']} htmlFor="">
        <span className={styles['label__title']}>Email address</span>
        <input
          className={styles['label__input']}
          type="email"
          placeholder="Email address"
          {...register('email', { required: true, validate: isEmail })}
          style={{ borderColor: errors.email ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)' }}
        />
        {errors.email && errors.email.type === 'required' && (
          <span className={styles['error-message']}>Email is required</span>
        )}
        {errors.email && errors.email.type === 'validate' && (
          <span className={styles['error-message']}>Email is invalid</span>
        )}
      </label>

      {/* password*/}

      <label className={styles['label']} htmlFor="">
        <span className={styles['label__title']}>Password</span>
        <input
          className={styles['label__input']}
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
          name="password"
          aria-invalid={errors.password ? true : false}
          style={{ borderColor: errors.password ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)' }}
        />
        {errors.password && errors.password.type === 'required' && (
          <span className={styles['error-message']}>Password is required</span>
        )}
        {typeof serverErrors === 'object' &&
          serverErrors !== null &&
          serverErrors.errors &&
          serverErrors.errors.username && (
            <span className={styles['error-message']}>email or password is invalid</span>
          )}
      </label>

      <div className={styles['sign-up']}>
        <button className={styles['create-acc-btn']}>Login</button>
        <span className={styles.redirect}>
          Don’t have an account?{' '}
          <Link className={styles['redirect-link']} to="/sign-up">
            Sign Up.
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
