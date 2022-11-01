import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: { memberEmail: "user@email.com", password: "password123" },
  isLogin: false,
  userNickname: "",
  error: "",
};

const url = "http://13.209.21.117:3000";

export const __postLogin = createAsyncThunk(
  "posts/postLogin",
  async (payload, thunkAPI) => {
    const loginItems = {
      memberEmail: payload.memberEmail,
      password: payload.password,
    };
    try {
      const { data } = await axios.post(`${url}/members/login`, loginItems, {
        headers: {
          "Content-Type": `application/json`,
        },
      });
      const token = data.loginData.token;
      const localSet = window.localStorage;
      localSet.setItem("token", token);
      return thunkAPI.fulfillWithValue(data.loginData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: {
    [__postLogin.fulfilled]: (state, action) => {
      state.isLogin = true;
      state.userNickname = action.payload.nickname;
    },
    [__postLogin.rejected]: (state, action) => {
      state.isLogin = false;
      state.error = action.error;
    },
  },
});

export default loginSlice.reducer;
