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
  // const usdt = await USDT.deploy(2n ** 256n - 1n, "Tether USD", "USDT", 6);
  // console.log(`usdt: ${usdt.target}`);
  // const factory = await UniswapV2Factory.deploy(deployer);
  // console.log(`factory: ${factory.target}`);
  // const router = await UniswapV2Router.deploy(factory.target, WETH);
  // console.log(`router: ${router.target}`);
  // const vault = await Vault.deploy();
  // console.log(`vault: ${vault.target}`);
  // const clearingHouse = await ClearingHouse.deploy();
  // console.log(`clearingHouse: ${clearingHouse.target}`);
  // const marketRegistry = await MarketRegistry.deploy(factory.target);
  // console.log(`marketRegistry: ${marketRegistry.target}`);
  // const accountBalance = await AccountBalance.deploy(
  //   clearingHouse.target,
  //   marketRegistry.target,
  //   vault.target
  // );
  // console.log(`accountBalance: ${accountBalance.target}`);

  // const usdt = USDT.attach("0x046A8BB2C22Be6c749EeA89dd38da33565f3Aea4");
  // const factory = UniswapV2Factory.attach(
  //   "0x994c9936a10f2DD4bb8569a4D6C2D06F3D3F749d"
  // );
  // const router = UniswapV2Router.attach(
  //   "0x7a0b710ed5D0D2F708Af491F6D3dcff5D872EDef"
  // );
  // const vault = Vault.attach("0xdd5F1B42A9caa4883d685bD218CF3a9C08622FEb");

  const clearingHouse = ClearingHouse.attach(
    "0x2BcB8837A936Ef4c15572384738074c2C5EbB623"
  );
  // const marketRegistry = MarketRegistry.attach(
  //   "0x621fbbFF937F6F1d2E26e5a42aA4AE812cfD1942"
  // );
  // const accountBalance = AccountBalance.attach(
  //   "0xf58B3a6eCC08A9094517f0dEE9384E01A75bFBb4"
  // );
  // await clearingHouse.setMarketRegistry(marketRegistry);
  // await clearingHouse.setRouter(router);
  // await clearingHouse.setAccountBalance(accountBalance);
  // await clearingHouse.setVault(vault);
  // await marketRegistry.setClearingHouse(clearingHouse);

  // let tx = await marketRegistry.createPool("Bitcoin", "BTC", 8);
  // let txResult = await tx.wait();

  // const poolAddress = txResult.logs[5].args[0];
  // const baseTokenAddress = txResult.logs[5].args[1];
  // const queteTokenAddress = txResult.logs[5].args[2];

  // await marketRegistry.createPool("Ethereum", "ETH", 18);
  // await vault.setSettlementToken(usdt);
  // await vault.setClearingHouse(clearingHouse);

  // await clearingHouse.setQuoteToken(queteTokenAddress);
  // await clearingHouse.approve(queteTokenAddress);
  // await clearingHouse.approve(baseTokenAddress);
  // await clearingHouse.approve(poolAddress);

  await clearingHouse.initializePool(
    "0x6C730CF4cA93aDc80d58eDD8eC70b76568F317e9",
    100n * 10n ** 8n,
    5800000n * 10n ** 6n
  );
}

main();

// npx hardhat run ./scripts/perp.js --network sepolia
