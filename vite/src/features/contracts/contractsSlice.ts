import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contract } from "ethers";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { contracts } from "../../contracts/addresses";

interface Pair {
  name: string;
  address: string;
}

interface Contracts {
  [key: string]: Contract;
}

interface SetPairParams {
  pairs: Pair[];
  provider: BrowserProvider | JsonRpcSigner | null;
}

export interface ContractState {
  pairs: Pair[];
  virtualTokenContracts: Contracts;
  usdtContract: Contract | null;
  vaultContract: Contract | null;
  marketRegistryContracat: Contract | null;
  clearingHouseContract: Contract | null;
}

export const contractsSlice = createSlice({
  name: "contracts",
  initialState: {
    pairs: [] as Pair[],
    virtualTokenContracts: {} as Contracts,
    usdtContract: null,
    vaultContract: null,
    marketRegistryContracat: null,
    clearingHouseContract: null,
  } as ContractState,
  reducers: {
    setContract: (
      state,
      action: PayloadAction<BrowserProvider | JsonRpcSigner | null>
    ) => {
      const provider = action.payload;
      if (!provider) {
        return {
          pairs: [] as Pair[],
          virtualTokenContracts: {} as Contracts,
          usdtContract: null,
          vaultContract: null,
          marketRegistryContracat: null,
          clearingHouseContract: null,
        };
      }

      const usdtContract = new Contract(
        contracts.usdt.address,
        contracts.usdt.abi,
        provider
      );

      const vaultContract = new Contract(
        contracts.vault.address,
        contracts.vault.abi,
        provider
      );

      const marketRegistryContracat = new Contract(
        contracts.marketRegistry.address,
        contracts.marketRegistry.abi,
        provider
      );

      const clearingHouseContract = new Contract(
        contracts.clearingHouse.address,
        contracts.clearingHouse.abi,
        provider
      );

      const virtualTokenContracts = {} as Contracts;

      state.pairs.forEach((v: Pair) => {
        virtualTokenContracts[v.name] = new Contract(
          v.address,
          contracts.virtualToken.abi,
          provider
        );
      });

      if (provider) {
        return {
          pairs: state.pairs,
          virtualTokenContracts,
          usdtContract,
          vaultContract,
          marketRegistryContracat,
          clearingHouseContract,
        };
      }
    },

    setPairList: (state, action: PayloadAction<SetPairParams>) => {
      state.pairs = action.payload.pairs;
      setContract(action.payload.provider);
    },
  },
});

export const { setContract } = contractsSlice.actions;

export default contractsSlice.reducer;
