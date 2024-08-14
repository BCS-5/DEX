const { expect } = require("chai");

const maxUint256 = (BigInt(1) << BigInt(256)) - BigInt(1);

const approve = async (tokenAContract, account, spender) => {
  await tokenAContract.connect(account).approve(spender, maxUint256);
};

const mint = async (tokenAContract, tokenBContract, account, amount) => {
  await tokenAContract.connect(account).mint(amount);
  await tokenBContract.connect(account).mint(amount);
};
/*
describe("Perp vault testing 1", () => {
  it("test1", async () => {
    const [deployer, account1] = await ethers.getSigners();

    const WETH = await ethers.deployContract("VirtualToken2", [
      "WETH",
      "WETH",
      18,
    ]);
    const USDT = await ethers.deployContract("VirtualToken2", [
      "USDT",
      "USDT",
      6,
    ]);
    const factory = await ethers.deployContract("UniswapV2Factory", [
      deployer.address,
    ]);
    const router = await ethers.deployContract("UniswapV2Router02", [
      factory.target,
      WETH.target,
    ]);

    const marketRegistry = await ethers.deployContract("MarketRegistry", [
      factory.target,
    ]);
    const clearingHouse = await ethers.deployContract("ClearingHouse");
    const vault = await ethers.deployContract("Vault");
    const accountBalance = await ethers.deployContract("AccountBalance", [
      clearingHouse,
      marketRegistry,
      vault,
    ]);

    await clearingHouse.setMarketRegistry(marketRegistry);
    await clearingHouse.setRouter(router);
    await clearingHouse.setAccountBalance(accountBalance);
    await clearingHouse.setVault(vault);
    await marketRegistry.setClearingHouse(clearingHouse);

    await vault.setSettlementToken(USDT);
    await vault.setClearingHouse(clearingHouse);

    let tx = await marketRegistry.createPool("vBTC", "vBTC", 8);
    let txResult = await tx.wait();

    const poolAddress = txResult.logs[5].args[0];
    const baseTokenAddress = txResult.logs[5].args[1];
    const queteTokenAddress = txResult.logs[5].args[2];

    const pair = await ethers.getContractAt("UniswapV2Pair", poolAddress);
    const BASE = await ethers.getContractAt("VirtualToken", baseTokenAddress);
    const QUOTE = await ethers.getContractAt("VirtualToken", queteTokenAddress);

    await clearingHouse.setQuoteToken(QUOTE);
    await clearingHouse.approve(QUOTE);
    await clearingHouse.approve(BASE);
    await clearingHouse.approve(pair);

    approve(BASE, QUOTE, deployer, clearingHouse);

    approve(USDT, USDT, deployer, vault);
    approve(USDT, USDT, account1, vault);
    await mint(USDT, USDT, deployer, 1000000);
    await mint(USDT, USDT, account1, 1000000);

    await vault.deposit(1000000);
    await vault.connect(account1).deposit(1000000);
    console.log(
      `1000000 deposit 후 보증금: ${await vault.getTotalCollateral(deployer)}`
    );

    await clearingHouse.initializePool(BASE, 50000n, 100000n);
    console.log(await pair.getReserves());
    console.log(await pair.balanceOf(clearingHouse));

    await clearingHouse.addLiquidity(BASE, 10000n, 0n, 0n, maxUint256);
    console.log(
      `유동성 10000개 추가 후 보증금: ${await vault.getTotalCollateral(
        deployer
      )}`
    );

    console.log(await pair.getReserves());

    await clearingHouse.removeLiquidity(BASE, 7071n, 0n, 0n, maxUint256);
    console.log(
      `유동성 제거 후 보증금: ${await vault.getTotalCollateral(deployer)}`
    );

    console.log(await pair.getReserves());
    console.log(
      BASE.target,
      QUOTE.target,
      await pair.token0(),
      await pair.token1()
    );
    // function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
    tx = await clearingHouse.openPosition(
      BASE,
      true,
      true,
      100000n,
      100000n,
      0n,
      maxUint256
    );
    txResult = await tx.wait();
    console.log(txResult);
    console.log(await pair.getReserves());
    console.log(
      `100000개 롱 포지션 오픈 후 보증금: ${await vault.getTotalCollateral(
        deployer
      )}`
    );

    await clearingHouse
      .connect(account1)
      .addLiquidity(BASE, 200000n, 0n, 0n, maxUint256);

    await vault.claimRewards(deployer, pair);
    console.log(
      `수수료 claim 후 보증금: ${await vault.getTotalCollateral(deployer)}`
    );
    console.log(await pair.getReserves());

    await clearingHouse.openPosition(
      BASE,
      true,
      true,
      200000n,
      400000n,
      0n,
      maxUint256
    );
    console.log(await pair.getReserves());
    console.log(
      `400000개 롱 포지션 오픈 후 보증금: ${await vault.getTotalCollateral(
        deployer
      )}`
    );

    await vault.claimRewards(deployer, pair);
    await vault.connect(account1).claimRewards(account1, pair);
    console.log(
      `수수료 claim 후 보증금: ${await vault.getTotalCollateral(deployer)}`
    );
    console.log(
      `수수료 claim 후 보증금: ${await vault.getTotalCollateral(account1)}`
    );

    // await clearingHouse.openPosition(
    //   BASE,
    //   false,
    //   true,
    //   200000n,
    //   200000n,
    //   2500n,
    //   maxUint256
    // );
    // console.log(await pair.getReserves());
    // await clearingHouse.openPosition(
    //   BASE,
    //   true,
    //   false,
    //   200000n,
    //   50000n,
    //   0n,
    //   maxUint256
    // );
    // console.log(await pair.getReserves());
    // await clearingHouse.openPosition(
    //   BASE,
    //   false,
    //   false,
    //   200000n,
    //   maxUint256,
    //   50000n,
    //   maxUint256
    // );
    // console.log(await pair.getReserves());
    // await vault.claimRewards(deployer, pair);
    // await vault.connect(account1).claimRewards(account1, pair);
    // console.log(
    //   `수수료 claim 후 보증금: ${await vault.getTotalCollateral(deployer)}`
    // );
    // console.log(
    //   `수수료 claim 후 보증금: ${await vault.getTotalCollateral(account1)}`
    // );
  });
});
*/

describe("Perp account balance testing 1", () => {
  it("test1", async () => {
    const [deployer, account1] = await ethers.getSigners();

    const WETH = await ethers.deployContract("VirtualToken2", [
      "WETH",
      "WETH",
      18,
    ]);
    const USDT = await ethers.deployContract("USDT", [0, "USDT", "USDT", 6]);
    const factory = await ethers.deployContract("UniswapV2Factory", [
      deployer.address,
    ]);
    const router = await ethers.deployContract("UniswapV2Router02", [
      factory.target,
      WETH.target,
    ]);

    const marketRegistry = await ethers.deployContract("MarketRegistry", [
      factory.target,
    ]);
    const clearingHouse = await ethers.deployContract("ClearingHouse");
    const vault = await ethers.deployContract("Vault");
    const accountBalance = await ethers.deployContract("AccountBalance", [
      clearingHouse,
      marketRegistry,
      vault,
    ]);

    await clearingHouse.setMarketRegistry(marketRegistry);
    await clearingHouse.setRouter(router);
    await clearingHouse.setAccountBalance(accountBalance);
    await clearingHouse.setVault(vault);
    await marketRegistry.setClearingHouse(clearingHouse);
    await accountBalance.setKeeper(deployer);

    await vault.setSettlementToken(USDT);
    await vault.setClearingHouse(clearingHouse);

    let tx = await marketRegistry.createPool("vBTC", "vBTC", 8);
    let txResult = await tx.wait();

    const poolAddress = txResult.logs[5].args[0];
    const baseTokenAddress = txResult.logs[5].args[1];
    const queteTokenAddress = txResult.logs[5].args[2];

    const pair = await ethers.getContractAt("UniswapV2Pair", poolAddress);
    const BASE = await ethers.getContractAt("VirtualToken", baseTokenAddress);
    const QUOTE = await ethers.getContractAt("VirtualToken", queteTokenAddress);

    await clearingHouse.setQuoteToken(QUOTE);
    await clearingHouse.approve(QUOTE);
    await clearingHouse.approve(BASE);
    await clearingHouse.approve(pair);

    await accountBalance.setIndexPrice(BASE, 72222n * 10n ** 18n);

    await approve(BASE, deployer, clearingHouse);
    await approve(QUOTE, deployer, clearingHouse);

    await approve(USDT, deployer, vault);
    await approve(USDT, account1, vault);
    await USDT.issue(2000000 * 10 ** 6);
    await USDT.transfer(account1, 1000000 * 10 ** 6);

    console.log(await USDT.balanceOf(deployer));
    console.log(await USDT.balanceOf(account1));
    console.log(deployer.address, USDT.target);

    await vault.deposit(1000000 * 10 ** 6);
    await vault.connect(account1).deposit(1000000 * 10 ** 6);
    console.log(await vault.getTotalCollateral(deployer));
    console.log(await vault.getTotalCollateral(account1));

    await clearingHouse.initializePool(BASE, 1 * 10 ** 8, 65000 * 10 ** 6);
    console.log(await pair.getReserves());
    console.log(await pair.balanceOf(clearingHouse));

    console.log(await pair.getReserves());

    // function openPosition(address baseToken, bool isExactInput, bool isLong, uint margin, uint amountIn, uint amountOut, uint deadline) public hasPool(baseToken) {
    tx = await clearingHouse.openPosition(
      BASE,
      false,
      true,
      10n * 10n ** 6n,
      maxUint256,
      10n ** 6n,
      maxUint256
    );
    txResult = await tx.wait();
    let positionHash1 = txResult.logs[5].args[2];

    console.log(await pair.getReserves());
    console.log(
      `100000개 롱 포지션 오픈 후 보증금: ${await vault.getTotalCollateral(
        deployer
      )}`
    );

    tx = await clearingHouse
      .connect(account1)
      .openPosition(
        BASE,
        true,
        false,
        74n * 10n ** 6n,
        10n ** 6n,
        0n,
        maxUint256
      );
    txResult = await tx.wait();
    let positionHash2 = txResult.logs[5].args[2];

    console.log(await pair.getReserves());
    console.log(
      `100000개 롱 포지션 오픈 후 보증금: ${await vault.getTotalCollateral(
        account1
      )}`
    );
    let block = await ethers.provider.getBlock("latest");
    console.log("Updated block timestamp:", block.timestamp);
    console.log();

    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await accountBalance.setIndexPrice(BASE, 72222n * 10n ** 18n);
    block = await ethers.provider.getBlock("latest");
    console.log("Updated block timestamp:", block.timestamp);

    let position1 = await clearingHouse.getPosition(
      deployer,
      BASE,
      positionHash1
    );
    let position2 = await clearingHouse.getPosition(
      account1,
      BASE,
      positionHash2
    );
    console.log(
      await accountBalance.checkLiquidation(
        {
          margin: position1[0],
          positionSize: position1[1],
          openNotional: position1[2],
          isLong: position1[3],
          priceCumulativeLast: position1[4],
          openPositionTimestamp: position1[5],
          fundingRateCumulativeLast: position1[6],
        },
        BASE,
        pair
      )
    );
    console.log(
      await accountBalance.checkLiquidation(
        {
          margin: position2[0],
          positionSize: position2[1],
          openNotional: position2[2],
          isLong: position2[3],
          priceCumulativeLast: position2[4],
          openPositionTimestamp: position2[5],
          fundingRateCumulativeLast: position2[6],
        },
        BASE,
        pair
      )
    );
    console.log(position1);
    console.log(
      `포지션 종료 전 보증금: ${await vault.getTotalCollateral(deployer)}`
    );
    // function closePosition (address baseToken, bytes32 positionHash, uint amountIn, uint amountOut, uint deadline)
    await clearingHouse.closePosition(BASE, positionHash1, 100, 0, maxUint256);
    console.log(
      `포지션 종료 후 보증금: ${await vault.getTotalCollateral(deployer)}`
    );
    console.log(
      `account1 포지션 청산 전 보증금: ${await vault.getTotalCollateral(
        account1
      )}`
    );
    await clearingHouse.liquidate(account1, BASE, positionHash2);
    console.log(
      `account1 포지션 청산 후 보증금: ${await vault.getTotalCollateral(
        account1
      )}`
    );
  });
});

// npm install
// npx hardhat compile
// npx hardhat test
