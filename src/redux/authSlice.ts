import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import token from '../api/token';

export interface IUser {
  username: string;
  email: string;
  password: string;
  image?: string;
}

export interface IUserState {
  user: IUser | null;
  status?: string | null;
  error?: string | Ierror | null;
  isLoggedIn: boolean;
}

interface Ierror {
  errors: { username?: string; email?: string; message?: string };
}

const initialState: IUserState = {
  user: null,
  status: null,
  error: null,
  isLoggedIn: false
};

export const registerUser = createAsyncThunk<IUser, IUser, { rejectValue: string }>(
  'registerUser/registerUser',
  async function (user, { rejectWithValue }) {
    try {
      const response = await fetch('https://blog.kata.academy/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          user: {
            username: user.username,
            email: user.email,
            password: user.password
          }
        })
      });
      if (response.ok) {
        const data = await response.json();

        return data.user;
      } else {
        const error = await response.json();
        return rejectWithValue(error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk<IUser, Partial<IUser>, { rejectValue: string | Ierror }>(
  'registerUser/updateUser',
  async function (userData, { rejectWithValue }) {
    try {
      const response = await fetch('https://blog.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          user: userData
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        const error = await response.json();
        return rejectWithValue(error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk<
  IUser,
  Pick<IUser, 'email' | 'password'>,
  { rejectValue: string | Ierror }
>('registerUser/loginUser', async function ({ email, password }, { rejectWithValue }) {
  try {
    const response = await fetch('https://blog.kata.academy/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email,
          password
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.user.token);
      return data.user;
    } else {
      const error = await response.json();
      return rejectWithValue(error);
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'registerUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'resolved';
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(
        registerUser.rejected,
        (state, action: PayloadAction<string | Ierror | undefined>) => {
          state.status = 'rejected';
          if (typeof action.payload === 'string') {
            state.error = action.payload;
          } else {
            state.error = action.payload;
          }
        }
      )
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'resolved';
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<string | Ierror | undefined>) => {
        state.status = 'rejected';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'resolved';
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | Ierror | undefined>) => {
        state.status = 'rejected';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = action.payload;
        }
      });
  }
});

export default userSlice.reducer;
export const { setUser, logoutUser } = userSlice.actions;
