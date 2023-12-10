import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KEY_SETTING } from '@/Constants';
import type { RootState } from '..';

export type Setting = {
  navType: 'breadcrumb' | 'historytab' | 'all';
  defaultMenuCollapse: boolean;
  menuTheme: 'dark' | 'light';
  collapseTheme: 'dark' | 'light';
};

const DEFAULT_SETTING: Setting = {
  navType: 'breadcrumb',
  defaultMenuCollapse: false,
  menuTheme: 'light',
  collapseTheme: 'light',
};

export const settingSlice = createSlice({
  name: 'setting',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    globalSetting: DEFAULT_SETTING as Setting,
  },
  reducers: {
    setGlobalSetting: (state, action: PayloadAction<Setting>) => {
      // 设置state，同时存入localStorage
      state.globalSetting = action.payload;
      localStorage.setItem(KEY_SETTING, JSON.stringify(action.payload));
    },
  },
});

export const { setGlobalSetting } = settingSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectGlobalSetting = (state: RootState) => state.setting.globalSetting;

export default settingSlice.reducer;
