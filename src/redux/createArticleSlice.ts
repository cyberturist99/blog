import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IArticle {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
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

export const createArticle = createAsyncThunk<IArticle, IArticle>(
  'articles/createArticle',
  async (article, thunkAPI) => {
    try {
      const response = await fetch('https://blog.kata.academy/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ article })
      });

      if (response.ok) {
        const data = await response.json();
        const slugs = getSlugsFromLocalStorage();
        slugs.push(data.article.slug);
        saveSlugsToLocalStorage(slugs);
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

export const updateArticle = createAsyncThunk<IArticle, { slug: string; article: IArticle }>(
  'articles/updateArticle',
  async ({ slug, article }, thunkAPI) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ article })
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

export const deleteArticle = createAsyncThunk<void, string>(
  'articles/deleteArticle',
  async (slug, thunkAPI) => {
    try {
      const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.errors);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

function getSlugsFromLocalStorage() {
  const slugs = localStorage.getItem('articleSlugs');
  return slugs ? JSON.parse(slugs) : [];
}
function saveSlugsToLocalStorage(slugs: string[]) {
  localStorage.setItem('articleSlugs', JSON.stringify(slugs));
}

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.status = 'succeeded';
        state.article = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default articleSlice.reducer;
