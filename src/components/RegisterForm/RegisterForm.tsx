import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../../redux/index';
import { registerUser } from '../../redux/authSlice';

import styles from './RegisterForm.module.scss';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  confirmCheckbox: boolean;
}

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<RegisterForm>();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const submit: SubmitHandler<RegisterForm> = async (data) => {
    const result = await dispatch(registerUser(data));
    unwrapResult(result);
    navigate('/articles');
  };

  const error: SubmitErrorHandler<RegisterForm> = (data) => {
    console.log('error', data);
  };

  const serverErrors = useSelector((state: RootState) => state.user.error);

  const validateUsername = (username: string) => {
    if (username.length >= 3 && username.length <= 20) {
      return true;
    }
    return false;
  };

  const isEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    if (password.length >= 6 && password.length <= 40) {
      return true;
    }
    return false;
  };

  const validateConfirmPassword = (confirmPassword: string, values: RegisterForm) => {
    if (confirmPassword !== values.password) {
      return 'Passwords do not match';
    }
    return true;
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit, error)} className={styles['register-form']}>
        <h3 className={styles.title}>Create new account</h3>
        <div className={styles['label-wrapper']}>
          <label className={styles['label']} htmlFor="">
            <span className={styles['label__title']}>Username</span>
            <input
              className={styles['label__input']}
              type="text"
              placeholder="Username"
              {...register('username', { required: true, validate: validateUsername })}
              style={{
                borderColor: errors.username ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
              }}
            />
            {errors.username && errors.username.type === 'required' && (
              <span className={styles['error-message']}>Username is required</span>
            )}
            {errors.username && errors.username.type === 'validate' && (
              <span className={styles['error-message']}>Username is invalid</span>
            )}
            {typeof serverErrors === 'object' &&
              serverErrors !== null &&
              serverErrors.errors &&
              serverErrors.errors.username && (
                <span className={styles['error-message']}>{serverErrors.errors.username}</span>
              )}
          </label>

          <label className={styles['label']} htmlFor="">
            <span className={styles['label__title']}>Email address</span>
            <input
              className={styles['label__input']}
              type="email"
              placeholder="Email address"
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
            {typeof serverErrors === 'object' &&
              serverErrors !== null &&
              serverErrors.errors &&
              serverErrors.errors.email && (
                <span className={styles['error-message']}>{serverErrors.errors.email}</span>
              )}
          </label>

          <label className={styles['label']} htmlFor="">
            <span className={styles['label__title']}>Password</span>
            <input
              className={styles['label__input']}
              {...register('password', { required: true, validate: validatePassword })}
              type="password"
              placeholder="Password"
              style={{
                borderColor: errors.password ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
              }}
            />
            {errors.password && errors.password.type === 'required' && (
              <span className={styles['error-message']}>Password is required</span>
            )}
            {errors.password && errors.password.type === 'validate' && (
              <span className={styles['error-message']}>
                Your password needs to be at least 6 characters.
              </span>
            )}
          </label>

          <label className={styles['label']} htmlFor="">
            <span className={styles['label__title']}>Repeat Password</span>
            <input
              className={styles['label__input']}
              type="password"
              placeholder="Password"
              {...register('confirmPassword', {
                required: true,
                validate: (value) => validateConfirmPassword(value, getValues())
              })}
              style={{
                borderColor: errors.confirmPassword ? 'rgba(245, 34, 45, 1)' : 'rgb(217, 217, 217)'
              }}
            />
            {errors.confirmPassword && errors.confirmPassword.type === 'required' && (
              <span className={styles['error-message']}>Password is required</span>
            )}
            {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
              <span className={styles['error-message']}>Passwords must match</span>
            )}
          </label>

          <label className={styles['confirm-wrapper']}>
            <input
              type="checkbox"
              className={styles['checkbox-confirm']}
              {...register('confirmCheckbox', { required: true })}
            />
            <span
              className={`${styles['text-confirm']} ${errors.confirmCheckbox ? styles['error-message'] : ''}`}
            >
              I agree to the processing of my personal information
            </span>
          </label>

          <div className={styles['sign-up']}>
            <button className={styles['create-acc-btn']}>Create</button>
            <span className={styles.redirect}>
              Already have an account?{' '}
              <Link className={styles['redirect-link']} to="/sign-in">
                Sign In.
              </Link>
            </span>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
