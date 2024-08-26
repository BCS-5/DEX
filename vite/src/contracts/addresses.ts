import AccountBalanceABI from "./abis/AccountBalanceABI.json";
import ClearingHouseABI from "./abis/ClearingHouseABI.json";
import ERC20ABI from "./abis/ERC20ABI.json";
import MarketRegistryABI from "./abis/MarketRegistryABI.json";
import UniswapV2FactoryABI from "./abis/UniswapV2FactoryABI.json";
import UniswapV2PairABI from "./abis/UniswapV2PairABI.json";
import UniswapV2RouterABI from "./abis/UniswapV2RouterABI.json";
import VaultABI from "./abis/VaultABI.json";
import FaucetABI from "./abis/FaucetABI.json";
import OrderABI from "./abis/OrderABI.json";

export const contracts = {
  accountBalance: {
    address: "0x1dDCac4613623824b1fbc944217bC5764bdD74e8",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0xAcA919554aACE3aE08aEba17Ad9519bE16234fa6",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0x9a37A60c1CaA20081E5543dF598Ac5a3CcA815C9",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0xbb6e5C64473ff98D7f2F98AA5E482D7c90E25c80",
    abi: VaultABI,
  },
  usdt: {
    address: "0xD7DBa4C3296477E3a97cEeE7D937D95f8aDD458E",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0x921C79fa5E725a8851501540fD0F73FD303173b3",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0x246EC513dFB505977161eBE4e81b025aF47A96DE",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
  faucet: {
    address: "0xCD298eb44046e3007DE3F6851F2e2a4cfDcc2942",
    abi: FaucetABI,
  },
  order: {
    address: "0x2E0fE78dfC725ECeeD2258318Fd81d851c2475f1",
    abi: OrderABI,
  },
};
