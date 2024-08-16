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
};
