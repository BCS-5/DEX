import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountState {
  balances: { [key: string]: number };
}

const initialState: AccountState = {
  balances: {},
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{ currency: string; amount: number }>) => {
      state.balances[action.payload.currency] = action.payload.amount;
    },
  },
});

export const { setBalance } = accountSlice.actions;

export default accountSlice.reducer;