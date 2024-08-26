import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contract } from "ethers";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { contracts } from "../../contracts/addresses";

interface Contracts {
  [key: string]: Contract;
}

interface SetPairsParams {
  name: string;
  address: string;
  provider: BrowserProvider | JsonRpcSigner;
}

export interface ContractState {
  pairContracts: Contracts;
  virtualTokenContracts: Contracts;
  usdtContract: Contract | null;
  vaultContract: Contract | null;
  marketRegistryContracat: Contract | null;
  clearingHouseContract: Contract | null;
  routerContract: Contract | null;
  accountBalanceContract: Contract | null;
  faucetContract: Contract | null;
  orderContract: Contract | null;
}

export const contractsSlice = createSlice({
  name: "contracts",
  initialState: {
    virtualTokenContracts: {} as Contracts,
    pairContracts: {} as Contracts,
    usdtContract: null,
    vaultContract: null,
    marketRegistryContracat: null,
    clearingHouseContract: null,
    routerContract: null,
    accountBalanceContract: null,
    faucetContract: null,
    orderContract: null
  } as ContractState,
  reducers: {
    setContract: (
      state,
      action: PayloadAction<BrowserProvider | JsonRpcSigner | null>
    ) => {
      const provider = action.payload;
      if (!provider) {
        return {
          virtualTokenContracts: {} as Contracts,
          pairContracts: {} as Contracts,
          usdtContract: null,
          vaultContract: null,
          marketRegistryContracat: null,
          clearingHouseContract: null,
          routerContract: null,
          accountBalanceContract: null,
          faucetContract: null,
          orderContract: null
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

      const routerContract = new Contract(
        contracts.uniswapV2Router.address,
        contracts.uniswapV2Router.abi,
        provider
      ) as Contract;

      const accountBalanceContract = new Contract(
        contracts.accountBalance.address,
        contracts.accountBalance.abi,
        provider
      ) as Contract;

      const faucetContract = new Contract(
        contracts.faucet.address,
        contracts.faucet.abi,
        provider
      ) as Contract;

      const orderContract = new Contract(
        contracts.order.address,
        contracts.order.abi,
        provider
      ) as Contract;

      return {
        virtualTokenContracts: state.virtualTokenContracts as any,
        pairContracts: state.pairContracts as any,
        usdtContract,
        vaultContract,
        marketRegistryContracat,
        clearingHouseContract,
        routerContract,
        accountBalanceContract,
        faucetContract,
        orderContract
      };
    },

    setPairs: (state, action: PayloadAction<SetPairsParams>) => {
      state.pairContracts[action.payload.name] = new Contract(
        action.payload.address,
        contracts.uniswapV2Pair.abi,
        action.payload.provider
      ) as any;
    },

    setVirtualTokens: (state, action: PayloadAction<SetPairsParams>) => {
      state.virtualTokenContracts[action.payload.name] = new Contract(
        action.payload.address,
        contracts.virtualToken.abi,
        action.payload.provider
      ) as any;
    },
  },
});

export const { setContract, setPairs, setVirtualTokens } =
  contractsSlice.actions;

export default contractsSlice.reducer;
