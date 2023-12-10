import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { User } from '@/types';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userinfo: null as User | null,
    isSubscrbed: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.userinfo = action.payload;
    },
    setSubscribe: (state, action: PayloadAction<boolean>) => {
      state.isSubscrbed = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export const { setSubscribe } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserInfo = (state: RootState) => state.user.userinfo;
export const isSubscrbedInfo = (state: RootState) => state.user.isSubscrbed;

export default userSlice.reducer;
