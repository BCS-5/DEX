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

const orderContract = new web3.eth.Contract(
  contracts.order.abi,
  contracts.order.address
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
  .getPool("0x60aB00c8e53AC83E5773DBea4E65cf990B93E1Eb")
  .call()
  .then((addr) => (poolAddress = addr));

const positionMap = new Map();
const closedPosition = {};

const orderMap = new Map();
const closedOrder = {};

const liquidate = () => {
  const asyncReqs = [];
  const positionArray = [];
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
      console.log(`execute liquidation traders: ${traders}`);
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

const executeOrder = () => {
  const asyncReqs = [];
  const orderArray = [];
  orderMap.forEach((v, k) => {
    if (closedOrder[k]) return;
    asyncReqs.push(orderContract.methods.checkExecutionCondition(v).call());
    orderArray.push(k);
  });

  Promise.all(asyncReqs).then((res) => {
    let flag = true;
    res.forEach((v, idx) => {
      if (v && flag) {
        const orderId = orderArray[idx];
        console.log(
          `execute order trader: ${orderMap.get(orderId).trader}, orderId: ${orderId}`
        );
        orderContract.methods.executeOrder(orderId).send({
          from: account.address,
          gas: "1000000",
          nonce: nonce++,
        });
        flag = true;
        return;
      }
    });
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

  if (
    trader.toLowerCase() ===
    "0x000000c2028C057617891ECB15B8159F4249F0E3".toLowerCase()
  )
    return;

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

const openOrder = (order) => {
  const { trader, baseToken, orderId, margin, amountIn, amountOut, isLong } =
    order;

  orderMap.set(orderId, {
    trader,
    baseToken,
    orderId,
    margin,
    amountIn,
    amountOut,
    isLong,
    status: 0,
  });
};

const closeOrder = (order) => {
  const { orderId } = order;
  orderMap.delete(orderId);
  closedOrder[orderId] = true;
};

const getIndexPrice = async () => {
  fetch(
    "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD"
  ).then((response) => response.json().then(setIndexPrice));
};

const setIndexPrice = async (res) => {
  let indexPrice = BigInt(res.RAW.BTC.USD.PRICE * 10 ** 18);
  console.log(indexPrice);
  accountBalanceContract.methods
    .setIndexPrice("0x60aB00c8e53AC83E5773DBea4E65cf990B93E1Eb", indexPrice)
    .send({
      from: account.address,
      gas: "300000",
      nonce: nonce++,
    });
};
const subscribe = async () => {
  const subscribeCallback = async () => {
    const subscription = await web3.eth.subscribe("newHeads");
    subscription.on("data", async (newBlock) => {
      nonce = await web3.eth.getTransactionCount(account.address);

      liquidate();
      executeOrder();

      if (parseInt(newBlock.number) % 2 == 0) {
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

    orderContract.events
      .OrderCreated({
        fromBlock: 0,
      })
      .on("data", (event) => {
        openOrder(event.returnValues);
      });

    orderContract.events
      .OrderExecuted({
        fromBlock: 0,
      })
      .on("data", (event) => {
        closeOrder(event.returnValues);
      });

    orderContract.events
      .OrderCancelled({
        fromBlock: 0,
      })
      .on("data", (event) => {
        closeOrder(event.returnValues);
      });
  };

  setSubscriptionCallback(subscribeCallback);
};

subscribe();

// node src/keeper/keeper.js
// nohup node src/keeper/keeper.js > keeper.out 2>&1 &
