import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { HOME_URL } from "@/config/config";
import type { MenuProps } from 'antd';

export interface TabsState {
	tabsActive: string;
	tabsList: MenuProps['items'];
}

const namespace = 'tabs';

const initialState: TabsState = {
	tabsActive: HOME_URL,
	tabsList: [{ label: "首页", key: HOME_URL }]
};

const tabsSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setTabsActive: (state, action:PayloadAction<string>) => {
      state.tabsActive = action.payload;
    },
    setTabsList: (state, action:PayloadAction<MenuProps['items']>) => {
      state.tabsList = action.payload;
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const selectSettings = (state: RootState) => state.tabs;

export const { setTabsActive, setTabsList } = tabsSlice.actions;

export default tabsSlice.reducer;