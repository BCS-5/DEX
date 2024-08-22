const V2PairABI = require("./abis/UniswapV2Pair.json");
const ERC20ABI = require("./abis/ERC20.json");
const PriceVolume = require("../db/price");
require("dotenv").config();

async function getDecimals(address) {
  const tokenContract = new web3.eth.Contract(ERC20ABI, address);
  const decimals = await tokenContract.methods.decimals().call();
  return decimals;
}

class TradingVolumeHandler {
  constructor(poolAddress, baseAddress, poolName) {
    this.volumeTable = new PriceVolume("BTC_PRICE_VOLUME_", 1722470400000);

    this.volumeTable.createTable();
    this.volumeTable.initialize();

    this.poolContract = new web3.eth.Contract(
      V2PairABI,
      poolAddress
      // "0x51AC7a5363751fa19F1186f850f15a1E1Dd8F8db"
    );

    // this.baseAddress = "0x1BCe644E5AEe9cEb88b13fa4894f7a583e7E350b";
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

  async subscribe() {
    this.subscription = await web3.eth.subscribe("newHeads");
    this.subscription.on("data", (newBlock) => {
      if (Number(newBlock.number) % 300 == 0) {
        console.log(newBlock.number);
      }

      this.poolContract.methods
        .getReserves()
        .call()
        .then((data) => {
          if (!this.isBase) {
            [data._reserve1, data._reserve0] = [data._reserve0, data._reserve1];
          }

          this.volumeTable.updatePrice(
            (Number(data._reserve1) * 10 ** this.decimals) /
              Number(data._reserve0),
            Number(newBlock.timestamp) * 1000
          );
        });
    });
  }

  async unsubscribe() {
    this.subscription.unsubscribe();
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
