/* eslint-disable import/named */
import { configureStore, Reducer, Action } from '@reduxjs/toolkit';

import { IArticlesState } from './slice';
import articlesReducer from './slice';
import userReducer, { IUserState } from './authSlice';
import articleSlice, { IArticleState } from './createArticleSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer as Reducer<IArticlesState, Action>,
    user: userReducer as Reducer<IUserState>,
    article: articleSlice as Reducer<IArticleState>
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
