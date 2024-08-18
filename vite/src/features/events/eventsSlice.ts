import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface eventState {
  onClickOutside: boolean;
  blockNumber: number;
}

export const eventsSlice = createSlice({
  name: "events",
  initialState: {
    onClickOutside: false,
    blockNumber: 0,
  } as eventState,
  reducers: {
    onClickOutside: (state) => {
      state.onClickOutside = !state.onClickOutside;
    },
    newBlockHeads: (state, action: PayloadAction<number>) => {
      state.blockNumber = action.payload;
    },
    switchNetwork: (_, action: PayloadAction<number>) => {
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + action.payload.toString(16) }],
      });
    },
  },
});

export const { onClickOutside, newBlockHeads, switchNetwork } =
  eventsSlice.actions;

export default eventsSlice.reducer;
