import AccountBalanceABI from "./abis/AccountBalanceABI.json";
import ClearingHouseABI from "./abis/ClearingHouseABI.json";
import ERC20ABI from "./abis/ERC20ABI.json";
import MarketRegistryABI from "./abis/MarketRegistryABI.json";
import UniswapV2FactoryABI from "./abis/UniswapV2FactoryABI.json";
import UniswapV2PairABI from "./abis/UniswapV2PairABI.json";
import UniswapV2RouterABI from "./abis/UniswapV2RouterABI.json";
import VaultABI from "./abis/VaultABI.json";

export const contracts = {
  accountBalance: {
    address: "0xf58B3a6eCC08A9094517f0dEE9384E01A75bFBb4",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0x7Bd2692018e58E80e0Cf517194ce7caF852b3D48",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0x621fbbFF937F6F1d2E26e5a42aA4AE812cfD1942",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0xdd5F1B42A9caa4883d685bD218CF3a9C08622FEb",
    abi: VaultABI,
  },
  usdt: {
    address: "0x046A8BB2C22Be6c749EeA89dd38da33565f3Aea4",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0x7a0b710ed5D0D2F708Af491F6D3dcff5D872EDef",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0x994c9936a10f2DD4bb8569a4D6C2D06F3D3F749d",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
};
