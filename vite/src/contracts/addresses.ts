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
    address: "0x5a40bb3d07024840b135EBC8011A834349bADD51",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0x2BcB8837A936Ef4c15572384738074c2C5EbB623",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0x91A2CD21Ac2d61F46E6710cf5b85FDFF5a819295",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0xBea0e9DEa2e5398DF7a84eadEc34861B230D8e94",
    abi: VaultABI,
  },
  usdt: {
    address: "0xF59a8209223e7cF01EE469e7b91507B2D9A0b84d",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0x2Da59aDFB7883BbCdF3141909Cbe9B95F43f2927",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0x254E316Dc057CF7B085F1A955c96E16e0D81dd61",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
};