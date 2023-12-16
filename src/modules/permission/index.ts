import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const namespace = 'permission';

export interface PermissionState {
  routes: any;
  pathData: any;
  breadcrumbList: any;
};

const initialState: PermissionState = {
  routes: [],
  pathData: {},
  breadcrumbList: []
};

const permissionSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setRoutes: (state, action:PayloadAction<any>) => {
      state.routes = action.payload;
    },
    setPathData: (state, action:PayloadAction<any>) => {
      state.pathData = action.payload;
    },
    setBreadcrumbList: (state, action:PayloadAction<any>) => {
      state.breadcrumbList = action.payload;
    },
  },
  extraReducers: (builder) => {
    
  }
})

export const selectPermission = (state: RootState) => state.permission;

export const { setRoutes, setPathData, setBreadcrumbList } = permissionSlice.actions;

export default permissionSlice.reducer;