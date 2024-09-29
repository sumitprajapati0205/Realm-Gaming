import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentComment: null,
  loading: false,
  error: false,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    commentSuccess: (state, action) => {
      state.loading = false;
      //updating the user.
      state.currentComment = action.payload;
    },
  },
});

export const { commentSuccess } =
  commentSlice.actions;

export default commentSlice.reducer;
