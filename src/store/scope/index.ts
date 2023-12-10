import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

export const idassScopeSlice = createSlice({
  name: 'scope',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    scopes: ['query:all'] as string[],
  },
  reducers: {
    /** 设置权限scope。如果权限列表数据不一样才去重新赋值 */
    setScopes: (state, action: PayloadAction<string[]>) => {
      const old = state.scopes;
      const scopes = action.payload;
      // array长度不一样
      if (old.length !== scopes.length) {
        console.log('重新设置scope', scopes);
        state.scopes = scopes;
      } else {
        // old所有child是否都在scopes中存在
        let equal = true;
        old.forEach((v) => {
          equal = scopes.indexOf(v) !== -1;
        });
        if (!equal) {
          console.log('重新设置scope', scopes);
          state.scopes = scopes;
        }
      }
    },
  },
});

export const { setScopes } = idassScopeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIdaasScopes = (state: RootState) => state.scope.scopes;

export default idassScopeSlice.reducer;
