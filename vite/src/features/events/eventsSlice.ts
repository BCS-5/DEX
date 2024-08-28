import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface eventState {
  onClickOutside: boolean;
  blockNumber: number;
  markPrice: string;
  slippage: string;
  deadline: string;
}

export const eventsSlice = createSlice({
  name: "events",
  initialState: {
    onClickOutside: false,
    blockNumber: 0,
    markPrice: "0.0",
    slippage: "0.5",
    deadline: "10",
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
    setMarkPrice: (state, action: PayloadAction<string>) => {
      state.markPrice = action.payload;
    },
    setSlippage: (state, action: PayloadAction<string>) => {
      // console.log(action.payload);
      state.slippage = action.payload;
    },
    setDeadline: (state, action: PayloadAction<string>) => {
      state.deadline = action.payload;
    },
  },
});

export const {
  onClickOutside,
  newBlockHeads,
  switchNetwork,
  setMarkPrice,
  setSlippage,
  setDeadline,
} = eventsSlice.actions;

export default eventsSlice.reducer;
