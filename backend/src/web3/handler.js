const { contracts } = require("../../contracts/addresses");
const FundingRate = require("../db/funding");
const LiquidityPositions = require("../db/liquidity");
const Positions = require("../db/positions");
const PriceVolume = require("../db/price");
const { web3, setSubscriptionCallback } = require("./web3Provider");

require("dotenv").config();

async function getDecimals(address) {
  const tokenContract = new web3.eth.Contract(
    contracts.virtualToken.abi,
    address
  );
  const decimals = await tokenContract.methods.decimals().call();
  return decimals;
}

class TradingVolumeHandler {
  constructor(poolAddress, baseAddress, poolName) {
    this.volumeTable = new PriceVolume(
      `${poolName}_PRICE_VOLUME_`,
      1724227200000
    );

    this.volumeTable.createTable();
    // this.volumeTable.initialize();

    this.positionsTable = new Positions("BTC_POSITIONS");
    this.positionsTable.createTable();

    this.liquidityPositionsTable = new LiquidityPositions(
      "LIQUIDITY_POSITIONS"
    );
    this.liquidityPositionsTable.createTable();

    this.fundingRateTable = new FundingRate("BTC_FUNDING_RATE");
    this.fundingRateTable.createTable();

    this.accountBalanceContract = new web3.eth.Contract(
      contracts.accountBalance.abi,
      contracts.accountBalance.address
    );

    this.poolContract = new web3.eth.Contract(
      contracts.uniswapV2Pair.abi,
      poolAddress
    );

    this.poolAddress = poolAddress;

    this.clearingHouseContract = new web3.eth.Contract(
      contracts.clearingHouse.abi,
      contracts.clearingHouse.address
    );

    this.vaultContract = new web3.eth.Contract(
      contracts.vault.abi,
      contracts.vault.address
    );

    this.baseAddress = baseAddress;
    this.decimals = 8;
    this.isBase = false;

    const self = this;
    getDecimals(baseAddress).then(
      (decimals) => (self.decimals = Math.abs(Number(decimals - 6n)))
    );
    this.poolContract.methods
      .token0()
      .call()
      .then(
        (address) =>
          (self.isBase = address.toUpperCase() == baseAddress.toUpperCase())
      );
  }

  async getCurrentPrice() {
    const data = await this.poolContract.methods.getReserves().call();
    if (!this.isBase) {
      [data._reserve1, data._reserve0] = [data._reserve0, data._reserve1];
    }
    return (
      (Number(data._reserve1) * 10 ** this.decimals) / Number(data._reserve0)
    );
  }

  async updateVolume(volume) {
    this.getCurrentPrice().then((price) => {
      this.volumeTable.updatePrice(price, Date.now(), Number(volume) / 10 ** 6);
    });
  }

  //   event ClosePosition(address indexed trader, address indexed baseToken, bytes32 positionHash, uint margin, uint positionSize, uint openNotional, bool isLong);

  async updatePosition(position) {
    this.positionsTable.updatePosition(
      position.trader,
      position.baseToken,
      position.positionHash,
      position.margin.toString(),
      position.positionSize.toString(),
      position.openNotional.toString(),
      position.isLong
    );
  }

  async closePosition(position) {
    this.positionsTable.closePosition(
      position.trader,
      position.baseToken,
      position.positionHash,
      position.margin.toString(),
      position.positionSize.toString(),
      position.openNotional.toString(),
      position.isLong
    );
  }

  async claimRewards(lpProvider) {
    console.log(lpProvider);

    this.liquidityPositionsTable.updateFees(
      lpProvider.trader,
      lpProvider.poolAddress,
      Number(lpProvider.amount) / 10 ** 6
    );
  }

  // event AddLiquidity(address indexed provider, address indexed baseToken, uint liquidity);
  async addLiquidity(lpProvider) {
    this.liquidityPositionsTable.updateFees(
      lpProvider.provider,
      this.poolAddress,
      0
    );
  }

  async updateFundingRate() {
    const longValue = await this.accountBalanceContract.methods
      .cumulativeLongFundingRates(this.baseAddress)
      .call();
    const shortValue = await this.accountBalanceContract.methods
      .cumulativeShortFundingRates(this.baseAddress)
      .call();

    // console.log("updateFundingRate:", longValue, shortValue);
    this.fundingRateTable.insertFundingRate(
      longValue.toString(),
      shortValue.toString()
    );
  }

  async subscribe() {
    const subscribeCallback = async () => {
      this.subscription = await web3.eth.subscribe("newHeads");
      this.subscription.on("data", (newBlock) => {
        if (Number(newBlock.number) % 300 == 0) {
          console.log(newBlock.number);
        }

        this.updateVolume(0);
        this.updateFundingRate();
      });

      this.clearingHouseContract.events
        .Buy({
          fromBlock: "lastest",
        })
        .on("data", (event) => this.updateVolume(event.returnValues.amountIn));

      this.clearingHouseContract.events
        .Sell({
          fromBlock: "lastest",
        })
        .on("data", (event) => this.updateVolume(event.returnValues.amountOut));
    
    this.clearingHouseContract.events
      .AddLiquidity({
        fromBlock: "lastest",
      })
      .on("data", (event) => {
        this.addLiquidity(event.returnValues);
      });
  
      this.clearingHouseContract.events
        .UpdatePosition({
          fromBlock: "lastest",
        })
        .on("data", (event) => {
          this.updatePosition(event.returnValues);
        });

      this.clearingHouseContract.events
        .ClosePosition({
          fromBlock: "lastest",
        })
        .on("data", (event) => {
          this.closePosition(event.returnValues);
        });

      this.vaultContract.events
        .Claimed({
          fromBlock: "lastest",
        })

        .on("data", (event) => {
          this.claimRewards(event.returnValues);
        });
    };

    setSubscriptionCallback(subscribeCallback);
    subscribeCallback();
  }
}

module.exports = TradingVolumeHandler;

// nohup node index.js > index.out 2>&1 &

/*
테이블1: 24시간 거래량, 수수료


테이블2: 1시간 단위 cumulativeLongFundingRates, cumulativeShortFundingRates

테이블3,4: Volume, TVL 일별 정보

테이블5: 포지션 크기
테이블6: 예약주문 목록
테이블7: 사용자별 유동성 목록

*/
