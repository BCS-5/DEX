import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Eip1193Provider } from "ethers";
import { BrowserProvider, ethers, JsonRpcSigner } from "ethers";

export interface ProviderState {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number;
}

export const providersSlice = createSlice({
  name: "providers",
  initialState: {
    provider: null,
    signer: null,
    chainId: 1,
  } as ProviderState,
  reducers: {
    setProvider: (state, action: PayloadAction<Eip1193Provider>) => {
      state.provider = new ethers.BrowserProvider(action.payload);
    },
    setSigner: (state, action: PayloadAction<JsonRpcSigner | null>) => {
      state.signer = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
  },
});

export const { setSigner, setProvider, setChainId } = providersSlice.actions;

export default providersSlice.reducer;