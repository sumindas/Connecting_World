import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
  },
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload.post);
    },
    editPost: (state, action) => {
      state.posts.push(action.payload.post);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload.postId
      );
    },
  },
});

export const { addPost, deletePost } = postSlice.actions;
export default postSlice.reducer;
