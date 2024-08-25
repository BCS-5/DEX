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
  const Faucet = await hre.ethers.getContractFactory("Faucet");

  // const usdt = USDT.attach("0xFBcfcc01567ABD73EbFBf5F7cbc34f9af46c05a8");
  // const factory = UniswapV2Factory.attach(
  //   "0xA257877ebD73E9a4a965633a49185A96A67c2d85"
  // );
  // const router = UniswapV2Router.attach(
  //   "0x33d402939C6f29e3c690EeF38fEE8fDC325cefb0"
  // );
  // const vault = Vault.attach("0xabBDc5FDFA7fA501f4D40BAF61a351a5ba4dD44E");

  // // vault.depositFor(
  // //   "0x2FFA65948795F91D2FcB6E10c3F8cc4440d416a6",
  // //   10000000n * 10n ** 6n
  // // );

  // const clearingHouse = ClearingHouse.attach(
  //   "0xA39FBe956E5e28ef652BE0f9061e0cE0Fd10844C"
  // );
  // const marketRegistry = MarketRegistry.attach(
  //   "0x47D5EE506c1Fbc1f29d355846D1ad5EeD496D70c"
  // );
  // const accountBalance = AccountBalance.attach(
  //   "0x882931AcDD87E8A20D7eda00C594cB9b6811eAC7"
  // );
  // const faucet = Faucet.attach("0x5BaA076CECF48FD5d760E80A095B950205AD7855");

  const usdt = await USDT.deploy(2n ** 256n - 1n, "Tether USD", "USDT", 6);
  console.log(`usdt: ${usdt.target}`);
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
  const faucet = await Faucet.deploy();
  console.log(`faucet: ${faucet.target}`);

  await faucet.setUSDTAddress(usdt, { gasLimit: "300000" });
  await clearingHouse.setMarketRegistry(marketRegistry, { gasLimit: "300000" });

  await clearingHouse.setRouter(router, { gasLimit: "300000" });
  await clearingHouse.setAccountBalance(accountBalance, { gasLimit: "300000" });
  await clearingHouse.setVault(vault, { gasLimit: "300000" });
  await marketRegistry.setClearingHouse(clearingHouse, { gasLimit: "300000" });

  let tx = await marketRegistry.createPool("Bitcoin", "BTC", 8, {
    gasLimit: "5000000",
  });
  let txResult = await tx.wait();

  const poolAddress = txResult.logs[5].args[0];
  const baseTokenAddress = txResult.logs[5].args[1];
  const queteTokenAddress = txResult.logs[5].args[2];

  await vault.setSettlementToken(usdt, { gasLimit: "300000" });
  await vault.setClearingHouse(clearingHouse, { gasLimit: "300000" });

  await clearingHouse.setQuoteToken(queteTokenAddress, { gasLimit: "300000" });
  await clearingHouse.approve(queteTokenAddress, { gasLimit: "300000" });
  await clearingHouse.approve(baseTokenAddress, { gasLimit: "300000" });
  await clearingHouse.approve(poolAddress, { gasLimit: "300000" });

  await accountBalance.setKeeper(deployer, { gasLimit: "300000" });

  await clearingHouse.initializePool(
    baseTokenAddress,
    1000n * 10n ** 8n,
    64100000n * 10n ** 6n,
    { gasLimit: "3000000" }
  );

  const balance = await usdt.balanceOf(deployer);
  await usdt.approve(vault, balance, { gasLimit: "300000" });

  await vault.deposit(100000000n * 10n ** 6n, { gasLimit: "3000000" });
}

main();

// npx hardhat run ./scripts/perp.js --network sepolia
