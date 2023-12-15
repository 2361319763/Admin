import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { getUserInfo } from "@/api/system/login";
import defAva from '@/assets/images/profile.jpg'

const namespace = 'user';

export interface UserState {
  token: string;
  name: string;
  avatar: string;
  roles: string[];
  permissions: string[];
};

const initialState: UserState = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  permissions: []
}

// 获取用户信息
export const GetInfo = createAsyncThunk(`${namespace}/GetInfo`,async () => {
  const response = await getUserInfo();
  return response;
})

const userSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    SetToken: (state, action:PayloadAction<string>) => {
      state.token = action.payload;
      setToken(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetInfo.fulfilled, (state, action) => {
        const user = action.payload.user;
        const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
        if (action.payload.roles && action.payload.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          state.roles = action.payload.roles;
          state.permissions = action.payload.permissions;
        }
        state.avatar = avatar;
        state.name = user.userName || '';
      })
  },
})

export const selectUser = (state: RootState) => state.user;

export const { SetToken } = userSlice.actions;

export default userSlice.reducer;