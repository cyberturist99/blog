/* eslint-disable import/named */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import token from '../api/token';

export const fetchArticles = createAsyncThunk<IArticle[], number, { rejectValue: string }>(
  'getArticles/fetchArticles',
  async function (offset, { rejectWithValue }) {
    try {
      const response = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${offset}`,
        {
          method: 'GET',
          headers: { Authorization: `Token ${token}` }
        }
      );
      const data = await response.json();

      return data.articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

export interface IArticlesState {
  articles: IArticle[];
  status: string | null;
  error: string | null;
}

export interface IArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  author: Iauthor;
}

interface Iauthor {
  username: string;
  bio?: string;
  image: string;
  following: boolean;
}

export const initialState: IArticlesState = {
  articles: [],
  status: null,
  error: null
};

const slice = createSlice({
  name: 'getArticles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<IArticle[]>) => {
        state.status = 'resolved';
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'rejected';
        state.error = action.payload || 'Unknown error';
      });
  }
});

export default slice.reducer;
