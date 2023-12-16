import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { SizeType } from "antd/lib/config-provider/SizeContext";

export interface ThemeConfigProp {
	primary: string;
	isDark: boolean;
	weakOrGray: string;
	breadcrumb: boolean;
	tabs: boolean;
	footer: boolean;
}

interface GlobalState {
	token: string;
	userInfo: any;
  isCollapse: boolean;
	assemblySize: SizeType;
	themeConfig: ThemeConfigProp;
}

const namespace = 'settings';

const initialState: GlobalState = {
  token: "",
	userInfo: "",
  isCollapse: false,
	assemblySize: "middle",
	themeConfig: {
		// 默认 primary 主题颜色
		primary: "#1890ff",
		// 深色模式
		isDark: false,
		// 色弱模式(weak) || 灰色模式(gray)
		weakOrGray: "",
		// 面包屑导航
		breadcrumb: false,
		// 标签页
		tabs: false,
		// 页脚
		footer: false
	}
};

const settingsSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setToken: (state, action:PayloadAction<string>) => {
      state.token = action.payload;
    },
    setIsCollapse: (state, action:PayloadAction<boolean>) => {
      state.isCollapse = action.payload;
    },
    setAssemblySize: (state, action:PayloadAction<SizeType>) => {
      state.assemblySize = action.payload;
    },
    setThemeConfig: (state, action:PayloadAction<ThemeConfigProp>) => {
      state.themeConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    
  }
})

export const selectSettings = (state: RootState) => state.settings;

export const { setToken, setAssemblySize, setThemeConfig, setIsCollapse } = settingsSlice.actions;

export default settingsSlice.reducer;