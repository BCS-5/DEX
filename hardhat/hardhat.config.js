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
  etherscan: {
    apiKey: process.env.API_ETHERSCAN, // Etherscan API 키를 입력하세요
  },
};
// usdt: 0x046A8BB2C22Be6c749EeA89dd38da33565f3Aea4
// factory: 0x994c9936a10f2dd4bb8569a4d6c2d06f3d3f749d;
// router: 0x7a0b710ed5d0d2f708af491f6d3dcff5d872edef;
// vault: 0xdd5f1b42a9caa4883d685bd218cf3a9c08622feb;
// clearingHouse: 0x7bd2692018e58e80e0cf517194ce7caf852b3d48;
// marketRegistry: 0x621fbbff937f6f1d2e26e5a42aa4ae812cfd1942;
// accountBalance: 0xf58b3a6ecc08a9094517f0dee9384e01a75bfbb4;

// npx hardhat verify --network sepolia 0x046A8BB2C22Be6c749EeA89dd38da33565f3Aea4 115792089237316195423570985008687907853269984665640564039457584007913129639935 "Tether USD" "USDT" 6
// npx hardhat verify --network sepolia 0x994c9936a10f2dd4bb8569a4d6c2d06f3d3f749d 0x77777777C54FD7A001F50fa752e524ec9B08A487
// npx hardhat verify --network sepolia 0x7a0b710ed5d0d2f708af491f6d3dcff5d872edef 0x994c9936a10f2dd4bb8569a4d6c2d06f3d3f749d 0x7b79995e5f793a07bc00c21412e50ecae098e7f9
// npx hardhat verify --network sepolia 0xdd5f1b42a9caa4883d685bd218cf3a9c08622feb
// npx hardhat verify --network sepolia 0x7bd2692018e58e80e0cf517194ce7caf852b3d48
// npx hardhat verify --network sepolia 0x621fbbff937f6f1d2e26e5a42aa4ae812cfd1942 0x994c9936a10f2dd4bb8569a4d6c2d06f3d3f749d
// npx hardhat verify --network sepolia 0xf58b3a6ecc08a9094517f0dee9384e01a75bfbb4 0x7bd2692018e58e80e0cf517194ce7caf852b3d48 0x621fbbff937f6f1d2e26e5a42aa4ae812cfd1942 0xdd5f1b42a9caa4883d685bd218cf3a9c08622feb
