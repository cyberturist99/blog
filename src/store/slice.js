import { createSlice } from '@reduxjs/toolkit';

// const fetchArticles = {
//     'getArticles/fetchArticles',

// }

const slice = createSlice({
  name: 'getArticles',
  initialState: {
    articles: [],
    number: 0
  },
  reducers: {
    setNumber: (state, action) => {
      console.log(action.payload);
      state.number = action.payload;
    }
  }
});

export const { setNumber } = slice.actions;
export default slice.reducer;
