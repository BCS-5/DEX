require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();

const PERIPHERY_OPTIMIZER = {
  version: "0.6.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000000,
    },
  },
};

const CORE_OPTIMIZER = {
  version: "0.5.16",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000000,
    },
  },
};

const PERP_OPTIMIZER = {
  version: "0.8.26",
  settings: {
    optimizer: {
      enabled: true,
      runs: 999999,
    },
  },
};

const OPENZEPPELIN_OPTIMIZER = {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 999999,
    },
  },
};

// module.exports = {
// solidity: {
//   compilers: [PERIPHERY_OPTIMIZER],
//   overrides: {
//     "contracts/v2-core-contracts/UniswapV2Pair.sol": CORE_OPTIMIZER,
//     "contracts/v2-core-contracts/UniswapV2Factory.sol": CORE_OPTIMIZER,
//     "contracts/v2-core-contracts/UniswapV2ERC20.sol": CORE_OPTIMIZER,
//     "contracts/v2-core-contracts/libraries/SafeMath.sol": CORE_OPTIMIZER,
//     "contracts/v2-core-contracts/test/ERC20.sol": CORE_OPTIMIZER,
//     "contracts/v2-core-contracts/libraries/UQ112x112.sol": CORE_OPTIMIZER,
//     "contracts/v2-core-contracts/libraries/Math.sol": CORE_OPTIMIZER,
//     "contracts/AccountBalance.sol": PERP_OPTIMIZER,
//     "contracts/libraries/UQ112x112.sol": PERP_OPTIMIZER,
//     "contracts/ClearingHouse.sol": PERP_OPTIMIZER,
//     "contracts/MarketRegistry.sol": PERP_OPTIMIZER,
//     "contracts/Vault.sol": PERP_OPTIMIZER,
//     "contracts/interfaces/IVault.sol": PERP_OPTIMIZER,
//     "contracts/interfaces/IClearingHouse.sol": PERP_OPTIMIZER,
//     "contracts/libraries/UniswapV2Library.sol": PERP_OPTIMIZER,
//     "contracts/interfaces/IAccountBalance.sol": PERP_OPTIMIZER,
//     "contracts/interfaces/IMarketRegistry.sol": PERP_OPTIMIZER,
//     "contracts/VirtualToken2.sol": PERP_OPTIMIZER,
//     "contracts/VirtualToken.sol": PERP_OPTIMIZER,
//     "contracts/base/SafeOwnable.sol": PERP_OPTIMIZER,
//     "contracts/USDT.sol": PERP_OPTIMIZER,
//     "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol":
//       OPENZEPPELIN_OPTIMIZER,
//     "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol":
//       OPENZEPPELIN_OPTIMIZER,
//     "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol":
//       OPENZEPPELIN_OPTIMIZER,
//     "@openzeppelin/contracts/access/Ownable.sol": OPENZEPPELIN_OPTIMIZER,
//     "@openzeppelin/contracts/utils/Context.sol": OPENZEPPELIN_OPTIMIZER,
//   },
// },
//   networks: {
//     sepolia: {
//       url: `https://sepolia.infura.io/v3/${process.env.API_INFURA}`,
//       accounts: [process.env.PRIVATE_KEY],
//     },
//   },
// };

module.exports = {
  solidity: {
    compilers: [PERIPHERY_OPTIMIZER],
    overrides: {
      "contracts/v2-core-contracts/UniswapV2Pair.sol": CORE_OPTIMIZER,
      "contracts/v2-core-contracts/UniswapV2Factory.sol": CORE_OPTIMIZER,
      "contracts/v2-core-contracts/UniswapV2ERC20.sol": CORE_OPTIMIZER,
      "contracts/v2-core-contracts/libraries/SafeMath.sol": CORE_OPTIMIZER,
      "contracts/v2-core-contracts/test/ERC20.sol": CORE_OPTIMIZER,
      "contracts/v2-core-contracts/libraries/UQ112x112.sol": CORE_OPTIMIZER,
      "contracts/v2-core-contracts/libraries/Math.sol": CORE_OPTIMIZER,
      "contracts/AccountBalance.sol": PERP_OPTIMIZER,
      "contracts/libraries/UQ112x112.sol": PERP_OPTIMIZER,
      "contracts/ClearingHouse.sol": PERP_OPTIMIZER,
      "contracts/Faucet.sol": PERP_OPTIMIZER,
      "contracts/MarketRegistry.sol": PERP_OPTIMIZER,
      "contracts/Vault.sol": PERP_OPTIMIZER,
      "contracts/interfaces/IVault.sol": PERP_OPTIMIZER,
      "contracts/interfaces/IClearingHouse.sol": PERP_OPTIMIZER,
      "contracts/libraries/UniswapV2Library.sol": PERP_OPTIMIZER,
      "contracts/interfaces/IAccountBalance.sol": PERP_OPTIMIZER,
      "contracts/interfaces/IMarketRegistry.sol": PERP_OPTIMIZER,
      "contracts/VirtualToken2.sol": PERP_OPTIMIZER,
      "contracts/VirtualToken.sol": PERP_OPTIMIZER,
      "contracts/base/SafeOwnable.sol": PERP_OPTIMIZER,
      "contracts/USDT.sol": PERP_OPTIMIZER,
      "contracts/interfaces/IOpenOrder.sol": PERP_OPTIMIZER,
      "contracts/OpenOrder.sol": PERP_OPTIMIZER,
      "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol":
        OPENZEPPELIN_OPTIMIZER,
      "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol":
        OPENZEPPELIN_OPTIMIZER,
      "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol":
        OPENZEPPELIN_OPTIMIZER,
      "@openzeppelin/contracts/access/Ownable.sol": OPENZEPPELIN_OPTIMIZER,
      "@openzeppelin/contracts/utils/Context.sol": OPENZEPPELIN_OPTIMIZER,
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.API_INFURA}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.API_ETHERSCAN, // Etherscan API 키를 입력하세요
  },
};
 // const usdt = USDT.attach("0xD7DBa4C3296477E3a97cEeE7D937D95f8aDD458E");
  // const factory = UniswapV2Factory.attach(
  //   "0x246EC513dFB505977161eBE4e81b025aF47A96DE"
  // );
  // const router = UniswapV2Router.attach(
  //   "0x921C79fa5E725a8851501540fD0F73FD303173b3"
  // );
  // const vault = Vault.attach("0xbb6e5C64473ff98D7f2F98AA5E482D7c90E25c80");

  // const clearingHouse = ClearingHouse.attach(
  //   "0xB184ddE3e21a3c7e7e142264a7E558836CeaCdD2"
  // );
  // const marketRegistry = MarketRegistry.attach(
  //   "0x9a37A60c1CaA20081E5543dF598Ac5a3CcA815C9"
  // );
  // const accountBalance = AccountBalance.attach(
  //   "0x1dDCac4613623824b1fbc944217bC5764bdD74e8"
  // );
  // const faucet = Faucet.attach("0xCD298eb44046e3007DE3F6851F2e2a4cfDcc2942");
  // const openOrder = OpenOrder.attach(
  //   "0xAC13Ede9977D7FCEe289cD013Ee399d90Fa7Ef0f"
  // );

// npx hardhat verify --network sepolia 0xD7DBa4C3296477E3a97cEeE7D937D95f8aDD458E 115792089237316195423570985008687907853269984665640564039457584007913129639935 "Tether USD" "USDT" 6
// npx hardhat verify --network sepolia 0x246EC513dFB505977161eBE4e81b025aF47A96DE 0x77777777C54FD7A001F50fa752e524ec9B08A487
// npx hardhat verify --network sepolia 0x921C79fa5E725a8851501540fD0F73FD303173b3 0x246EC513dFB505977161eBE4e81b025aF47A96DE 0xbb6e5C64473ff98D7f2F98AA5E482D7c90E25c80
// npx hardhat verify --network sepolia 0xbb6e5C64473ff98D7f2F98AA5E482D7c90E25c80
// npx hardhat verify --network sepolia 0xB184ddE3e21a3c7e7e142264a7E558836CeaCdD2
// npx hardhat verify --network sepolia 0x9a37A60c1CaA20081E5543dF598Ac5a3CcA815C9 0x246EC513dFB505977161eBE4e81b025aF47A96DE
// npx hardhat verify --network sepolia 0x1dDCac4613623824b1fbc944217bC5764bdD74e8 0xB184ddE3e21a3c7e7e142264a7E558836CeaCdD2 0x9a37A60c1CaA20081E5543dF598Ac5a3CcA815C9 0xdd5f1b42a9caa4883d685bd218cf3a9c08622feb
// npx hardhat verify --network sepolia 0xCD298eb44046e3007DE3F6851F2e2a4cfDcc2942
// npx hardhat verify --network sepolia 0xAC13Ede9977D7FCEe289cD013Ee399d90Fa7Ef0f