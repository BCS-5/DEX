import AccountBalanceABI from "./abis/AccountBalanceABI.json";
import ClearingHouseABI from "./abis/ClearingHouseABI.json";
import ERC20ABI from "./abis/ERC20ABI.json";
import MarketRegistryABI from "./abis/MarketRegistryABI.json";
import UniswapV2FactoryABI from "./abis/UniswapV2FactoryABI.json";
import UniswapV2PairABI from "./abis/UniswapV2PairABI.json";
import UniswapV2RouterABI from "./abis/UniswapV2RouterABI.json";
import VaultABI from "./abis/VaultABI.json";
import FaucetABI from "./abis/FaucetABI.json";

export const contracts = {
  accountBalance: {
    address: "0x6355315C226aE4F31FbAe9b61F8c044079D19145",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0x056931211F0859b47Fa9c80d8B3b257E5f8D6cB7",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0x821b411e0d50517751F9cA7257a85bb9946e40E4",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0x8dF9874dDEe99fd4c591a37f9ecA1724266F7366",
    abi: VaultABI,
  },
  usdt: {
    address: "0x85885d5a79e6f55a2e8CcC19E08Ac12a7A310651",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0x67c284d74131Ff5EBFBcE5bbCd3C923e55C6F738",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0x70aFa16650dEC132e8AeBAab7Cf281fD2e58b684",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
  faucet: {
    address: "0xAB1496899C04b62C80c2d7bB03C61CBC1FC891f0",
    abi: FaucetABI,
  },
};
