/**
 * 推荐使用的全局状态管理模式
 * react-redux
 * react 官方推出的 redux 绑定库
 * @reduxjs/toolkit
 * Redux 官方强烈推荐，开箱即用的一个高效的 Redux 开发工具集
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import user from './user';
import permission from './permission';
import settings from './settings';
import tabs from './tabs';

const reducer = combineReducers({
  user,
  permission,
  settings,
  tabs
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;