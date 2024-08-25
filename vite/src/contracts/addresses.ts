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
    address: "0x882931AcDD87E8A20D7eda00C594cB9b6811eAC7",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0xA39FBe956E5e28ef652BE0f9061e0cE0Fd10844C",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0x47D5EE506c1Fbc1f29d355846D1ad5EeD496D70c",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0xabBDc5FDFA7fA501f4D40BAF61a351a5ba4dD44E",
    abi: VaultABI,
  },
  usdt: {
    address: "0xFBcfcc01567ABD73EbFBf5F7cbc34f9af46c05a8",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0x33d402939C6f29e3c690EeF38fEE8fDC325cefb0",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0xA257877ebD73E9a4a965633a49185A96A67c2d85",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
  faucet: {
    address: "0x5BaA076CECF48FD5d760E80A095B950205AD7855",
    abi: FaucetABI,
  },
};
