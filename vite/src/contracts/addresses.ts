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
    address: "0x287321A584676e91BEEeeb126592F3279D4c1d0e",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0xB184ddE3e21a3c7e7e142264a7E558836CeaCdD2",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0x5Ea4510F953695EF8616ce3B856e0603DBe90968",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0x3f208885AcECcCfA052EFd8Ed6624D3cB52063f4",
    abi: VaultABI,
  },
  usdt: {
    address: "0xad18005C6AafBa428eBD017F57Fc67fCE809Bfa4",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0x9cb08cBC35660cD27787072D049dba0738Bb997B",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0xD47d4d3d7155aeEF98A1De7aacFe28B35A9B7a15",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
  faucet: {
    address: "0x1D73e770918a923Dc2a045C82B0a5640c502d546",
    abi: FaucetABI,
  },
  order: {
    address: "0xAC13Ede9977D7FCEe289cD013Ee399d90Fa7Ef0f",
    abi: OrderABI,
  },
};
