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

  const usdt = USDT.attach("0x8e7eF834538bcBbCE5A546a31ed9b41F766A491c");
  const factory = UniswapV2Factory.attach(
    "0x01b8293Ead41f293F91A630aD0697e0B2D92E6FC"
  );
  const router = UniswapV2Router.attach(
    "0x4cA5Db20cAC8998bBB2Db00b25c0Bb86535fe68E"
  );
  const vault = Vault.attach("0x93b1C7fFbA83E18214F8370883AEC7daEE00557f");

  const clearingHouse = ClearingHouse.attach(
    "0xAb0678c1B6AAb55820F74dC87E13DB61F77B5D90"
  );
  const marketRegistry = MarketRegistry.attach(
    "0x0b1Fb4727C2133269f09A743cbF4Cf9338811Ac7"
  );
  const accountBalance = AccountBalance.attach(
    "0x1a726A778C2c215D6B50CB1E87fdd7Dad3B05FA1"
  );
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

  // await clearingHouse.approve("0xe94cE4efD00c9C002e1402F2BE72E5213EDfeB42");
  // await clearingHouse.approve("0x1BCe644E5AEe9cEb88b13fa4894f7a583e7E350b");
  // await clearingHouse.approve("0x51AC7a5363751fa19F1186f850f15a1E1Dd8F8db");
  // await accountBalance.setKeeper(deployer);

  // await clearingHouse.initializePool(
  //   "0x1BCe644E5AEe9cEb88b13fa4894f7a583e7E350b",
  //   100n * 10n ** 8n,
  //   5800000n * 10n ** 6n
  // );

  vault.on("Deposited", (collateralToken, trader, event) =>
    console.log(collateralToken, trader, event)
  );

  // const balance = await usdt.balanceOf(deployer);
  // await usdt.approve(vault, balance);

  await vault.deposit(1n);
}

main();

// npx hardhat run ./scripts/perp.js --network sepolia
