import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IArticle {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
  favoritesCount: number;
  favorited: boolean;
}

export interface IArticleState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  article: IArticle | null;
}

const initialState: IArticleState = {
  status: 'idle',
  error: null,
  article: null
};

export const favoriteArticle = createAsyncThunk<IArticle, string>(
  'articles/favoriteArticle',
  async (slug, thunkAPI) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.article;
      } else {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.errors);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const unfavoriteArticle = createAsyncThunk<IArticle, string>(
  'articles/unfavoriteArticle',
  async (slug, thunkAPI) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.article;
      } else {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.errors);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ... другие экшны ...

    builder
      .addCase(favoriteArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(favoriteArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(unfavoriteArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unfavoriteArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(unfavoriteArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default articleSlice.reducer;
