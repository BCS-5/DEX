const AccountBalanceABI = require("./abis/AccountBalanceABI.json");
const ClearingHouseABI = require("./abis/ClearingHouseABI.json");
const ERC20ABI = require("./abis/ERC20ABI.json");
const MarketRegistryABI = require("./abis/MarketRegistryABI.json");
const UniswapV2FactoryABI = require("./abis/UniswapV2FactoryABI.json");
const UniswapV2PairABI = require("./abis/UniswapV2PairABI.json");
const UniswapV2RouterABI = require("./abis/UniswapV2RouterABI.json");
const VaultABI = require("./abis/VaultABI.json");
const FaucetABI = require("./abis/FaucetABI.json");

const contracts = {
  accountBalance: {
    address: "0xee2256ca9F0Bf3Db0B6D96D6eB10D6d3E72f5DCD",
    abi: AccountBalanceABI,
  },
  clearingHouse: {
    address: "0x3Fe4c65CfA4A5E2C2AEFf87552C6BD855F2E28d8",
    abi: ClearingHouseABI,
  },
  marketRegistry: {
    address: "0xFb9D09E54CBac5a2e019c63691f7ce6D41c92520",
    abi: MarketRegistryABI,
  },
  vault: {
    address: "0x8498124783C9B9B17F93585d8B13B31096f6B00b",
    abi: VaultABI,
  },
  usdt: {
    address: "0xe5B3548929E1D8C740C357Cc3c05C8b4a34f0FBb",
    abi: ERC20ABI,
  },
  virtualToken: {
    address: "",
    abi: ERC20ABI,
  },
  uniswapV2Router: {
    address: "0xF08aB6c53C04FeeE86ded319103C6d8e5529b2BB",
    abi: UniswapV2RouterABI,
  },
  uniswapV2Factory: {
    address: "0xf0cd30b09FcAfc0478a9945088D8a99BF17A8815",
    abi: UniswapV2FactoryABI,
  },
  uniswapV2Pair: {
    address: "",
    abi: UniswapV2PairABI,
  },
  faucet: {
    address: "0x6835725af3b8536672Aee4FF72CDAB5a8f68356b",
    abi: FaucetABI,
  },
};

module.exports = { contracts };
