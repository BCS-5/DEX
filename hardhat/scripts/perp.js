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

  const usdt = USDT.attach("0x85885d5a79e6f55a2e8CcC19E08Ac12a7A310651");
  const factory = UniswapV2Factory.attach(
    "0x70aFa16650dEC132e8AeBAab7Cf281fD2e58b684"
  );
  const router = UniswapV2Router.attach(
    "0x67c284d74131Ff5EBFBcE5bbCd3C923e55C6F738"
  );
  const vault = Vault.attach("0x8dF9874dDEe99fd4c591a37f9ecA1724266F7366");

  const clearingHouse = ClearingHouse.attach(
    "0x056931211F0859b47Fa9c80d8B3b257E5f8D6cB7"
  );
  const marketRegistry = MarketRegistry.attach(
    "0x821b411e0d50517751F9cA7257a85bb9946e40E4"
  );
  const accountBalance = AccountBalance.attach(
    "0x6355315C226aE4F31FbAe9b61F8c044079D19145"
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

  // await accountBalance.setKeeper(deployer);

  // await clearingHouse.initializePool(
  //   baseTokenAddress,
  //   1000n * 10n ** 8n,
  //   61000000n * 10n ** 6n
  // );

  const balance = await usdt.balanceOf(deployer);
  // await usdt.approve(vault, balance);

  await vault.deposit(balance / 2n);
}

main();

// npx hardhat run ./scripts/perp.js --network sepolia
