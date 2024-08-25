const MinPriorityQueue = require("js-priority-queue"); // 오름차순 우선순위 큐
const MaxPriorityQueue = require("js-priority-queue"); // 내림차순 우선순위 큐

const { web3, setSubscriptionCallback } = require("./keeperProvider");
const { contracts } = require("../../contracts/addresses");

let nonce = 0;

const account = web3.eth.accounts.privateKeyToAccount(
  "0x" + process.env.PRIVATE_KEY
);
web3.eth.accounts.wallet.add(account);

const clearingHouseContract = new web3.eth.Contract(
  contracts.clearingHouse.abi,
  contracts.clearingHouse.address
);

const accountBalanceContract = new web3.eth.Contract(
  contracts.accountBalance.abi,
  contracts.accountBalance.address
);

const marketRegistryContract = new web3.eth.Contract(
  contracts.marketRegistry.abi,
  contracts.marketRegistry.address
);

let poolAddress = "";

marketRegistryContract.methods
  .getPool("0x573a8d46b10a9805d2ab8cfa00eb56f3929c67c0")
  .call()
  .then((addr) => (poolAddress = addr));

const positionMap = new Map();
const closedPosition = {};

const liquidate = () => {
  const asyncReqs = [];
  positionArray = [];
  positionMap.forEach((v, k) => {
    if (closedPosition[k]) return;
    asyncReqs.push(
      accountBalanceContract.methods
        .checkLiquidation(v.position, v.baseToken, v.poolAddress)
        .call()
    );
    positionArray.push({
      trader: v.trader,
      baseToken: v.baseToken,
      positionHash: v.positionHash,
    });
  });

  // function liquidateBatch (address[] memory traders, address[] memory baseTokens, bytes32[] memory positionHashs) external ;

  const traders = [];
  const baseTokens = [];
  const positionHashs = [];

  Promise.all(asyncReqs).then((res) => {
    res.forEach((v, idx) => {
      if (v) {
        traders.push(positionArray[idx].trader);
        baseTokens.push(positionArray[idx].baseToken);
        positionHashs.push(positionArray[idx].positionHash);
      }
    });

    if (traders.length) {
      clearingHouseContract.methods
        .liquidateBatch(traders, baseTokens, positionHashs)
        .send({
          from: account.address,
          gas: "1000000",
          nonce: nonce++,
        });
    }
  });
};

const updatePosition = (position) => {
  const {
    trader,
    baseToken,
    positionHash,
    margin,
    positionSize,
    openNotional,
    isLong,
  } = position;

  //   if (trader === "0x000000c2028C057617891ECB15B8159F4249F0E3") return;

  clearingHouseContract.methods
    .getPosition(trader, baseToken, positionHash)
    .call()
    .then((v) => {
      if (closedPosition[positionHash]) return;
      positionMap.set(positionHash, {
        position: [
          v.margin,
          v.positionSize,
          v.openNotional,
          v.isLong,
          v.priceCumulativeLast,
          v.openPositionTimestamp,
          v.fundingRateCumulativeLast,
        ],
        baseToken,
        poolAddress,
        trader,
        positionHash,
      });
    });
};

const closePosition = (position) => {
  const { positionHash } = position;
  positionMap.delete(positionHash);
  closedPosition[positionHash] = true;
};

const getIndexPrice = async () => {
  fetch(
    "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD"
  ).then((response) => response.json().then(setIndexPrice));
};

const setIndexPrice = async (res) => {
  let indexPrice = BigInt(res.RAW.BTC.USD.PRICE * 10 ** 18);
  accountBalanceContract.methods
    .setIndexPrice("0x573a8d46b10a9805d2ab8cfa00eb56f3929c67c0", indexPrice)
    .send({
      from: account.address,
      gas: "100000",
      nonce: nonce++,
    });
};
const subscribe = async () => {
  const subscribeCallback = async () => {
    const subscription = await web3.eth.subscribe("newHeads");
    subscription.on("data", async (newBlock) => {
      nonce = await web3.eth.getTransactionCount(account.address);
      if (Number(newBlock.blockNumber) % 2 == 1) {
        liquidate();
      }
      if (Number(newBlock.blockNumber) % 2 == 0) {
        getIndexPrice();
      }
    });

    clearingHouseContract.events
      .UpdatePosition({
        fromBlock: 0,
      })
      .on("data", (event) => {
        updatePosition(event.returnValues);
      });

    clearingHouseContract.events
      .ClosePosition({
        fromBlock: 0,
      })
      .on("data", (event) => {
        closePosition(event.returnValues);
      });
  };

  setSubscriptionCallback(subscribeCallback);
};

subscribe();

// node src/keeper/index.js
// nohup node src/keeper/index.js > keeper.out 2>&1 &
