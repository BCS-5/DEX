const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const USDT = await hre.ethers.getContractFactory("USDT");
  const WETH = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";

  const Vault = await hre.ethers.getContractFactory("Vault");
  const ClearingHouse = await hre.ethers.getContractFactory("ClearingHouse");
  const MarketRegistry = await hre.ethers.getContractFactory("MarketRegistry");
  const AccountBalance = await hre.ethers.getContractFactory("AccountBalance");
  const UniswapV2Factory = await hre.ethers.getContractFactory(
    "UniswapV2Factory"
  );
  const UniswapV2Router = await hre.ethers.getContractFactory(
    "UniswapV2Router02"
  );
  // constructor(uint256 _initialSupply, string memory _name, string memory _symbol, uint8 _decimals)
  //   const usdt = await USDT.deploy(2n ** 256n - 1n, "Tether USD", "USDT", 6);
  //   console.log(`usdt: ${usdt.target}`);
  const factory = await UniswapV2Factory.deploy(deployer);
  console.log(`factory: ${factory.target}`);
  const router = await UniswapV2Router.deploy(factory.target, WETH);
  console.log(`router: ${router.target}`);
  const vault = await Vault.deploy();
  console.log(`vault: ${vault.target}`);
  const clearingHouse = await ClearingHouse.deploy();
  console.log(`clearingHouse: ${clearingHouse.target}`);
  const marketRegistry = await MarketRegistry.deploy(factory.target);
  console.log(`marketRegistry: ${marketRegistry.target}`);
  const accountBalance = await AccountBalance.deploy(
    clearingHouse.target,
    marketRegistry.target,
    vault.target
  );
  console.log(`accountBalance: ${accountBalance.target}`);

  //   const con = await sampleCon.deploy();
  //   console.log(`contract address: ${con.target}`);
}

main();

// npx hardhat run ./scripts/perp.js --network sepolia
