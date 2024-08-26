var { ethers, WebSocketProvider } = require("ethers");
require("dotenv").config();
const { contracts } = require("./contracts/addresses.js");
const provider = new WebSocketProvider(
  `wss://sepolia.infura.io/ws/v3/${process.env.TRADING_INFURA_API_KEY}`
);

const signer = new ethers.Wallet(
  "0x" + process.env.TRADING_PRIVATE_KEY,
  provider
);

const baseAddress = "0x80d7c7205142CBf369f628DA4547191f9bE40A03";
const quoteAddress = "0xe05CDD30272f2D6Fa590Aa0f1dA18C80da807F0F";
const poolAddress = "0xAEaC6716b6E7F94c2A8Ec176fde1e68f1b5bC798";

const accountBalanceContract = new ethers.Contract(
  contracts.accountBalance.address,
  contracts.accountBalance.abi,
  signer
);

const clearingHouseContract = new ethers.Contract(
  contracts.clearingHouse.address,
  contracts.clearingHouse.abi,
  signer
);

const vault = new ethers.Contract(
  contracts.vault.address,
  contracts.vault.abi,
  signer
);

const poolContract = new ethers.Contract(
  poolAddress,
  contracts.uniswapV2Pair.abi,
  signer
);

const routerContract = new ethers.Contract(
  contracts.uniswapV2Router.address,
  contracts.uniswapV2Router.abi,
  signer
);

const UINT256_MAX = 2n ** 256n - 1n;

const calculateDxDy = (x, y, k) => {
  const dx = x - Math.sqrt((x * y) / k);
  const dy = k * (x - dx) - y;

  return { dx, dy };
};

const abs = (value) => {
  return value < 0n ? -value : value;
};

const getIndexPrice = async () => {
  fetch(
    "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD"
  ).then((response) => response.json().then(setIndexPrice));
};

const setIndexPrice = async (res) => {
  let indexPrice = BigInt(res.RAW.BTC.USD.PRICE * 10 ** 18);
  console.log(res.RAW.BTC.USD.PRICE);

  openPosition(indexPrice);
};

const openPosition = async (indexPrice) => {
  const reserves = await poolContract.getReserves();
  const token0 = await poolContract.token0();

  const [amount0, amount1] =
    token0.toUpperCase() === baseAddress.toUpperCase()
      ? [reserves[0], reserves[1]]
      : [reserves[1], reserves[0]];
  const { dx } = calculateDxDy(
    Number(amount0),
    Number(amount1),
    Number(indexPrice) / 10 ** 20
  );

  let amount = BigInt(Math.floor(dx));

  const maxAmount = abs((amount0 * 3n) / 1000n);

  amount =
    amount > maxAmount ? maxAmount : amount < -maxAmount ? -maxAmount : amount;

  if (amount == 0n) {
    return;
  } else if (amount > 0n) {
    buy(amount);
  } else {
    sell(-amount);
  }
};

const buy = async (amount) => {
  openPositionLong(amount);
};

const sell = async (amount) => {
  openPositionShort(amount);
};

const openPositionLong = (amount) => {
  const path = [quoteAddress, baseAddress];
  routerContract.getAmountsIn(amount, path).then((amounts) => {
    clearingHouseContract.openPosition(
      baseAddress,
      false,
      true,
      amounts[0],
      UINT256_MAX,
      amounts[1],
      Math.floor(Date.now() / 1000) + 600,
      {
        gasLimit: 400000,
      }
    );
  });
};

const openPositionShort = (amount) => {
  const path = [baseAddress, quoteAddress];

  routerContract.getAmountsOut(amount, path).then((amounts) => {
    clearingHouseContract.openPosition(
      baseAddress,
      true,
      false,
      amounts[1],
      amounts[0],
      0,
      Math.floor(Date.now() / 1000) + 600,
      {
        gasLimit: 400000,
      }
    );
  });
};

// function closePosition (address baseToken, bytes32 positionHash, uint closePercent, uint slippageAdjustedAmount, uint deadline)
const closePosition = (positionHash, isLong, closePercent) => {
  const slippageAdjustedAmount = isLong ? 0 : UINT256_MAX;
  clearingHouseContract.closePosition(
    baseAddress,
    positionHash,
    closePercent,
    slippageAdjustedAmount,
    Math.floor(Date.now() / 1000) + 600,
    {
      gasLimit: 400000,
    }
  );
};

const claimRewards = () => {
  vault.claimRewards(signer.address, poolAddress);
};

// event UpdatePosition(address indexed trader, address indexed baseToken, bytes32 positionHash, uint margin, uint positionSize, uint openNotional);
// const filter = clearingHouseContract.filters.UpdatePosition(signer.address);
// clearingHouseContract.on(filter, (event) => {
//   clearingHouseContract
//     .getPosition(signer.address, baseAddress, event.args[2])
//     .then((res) => {
//       res[3]
//         ? longPositions.push(event.args[2])
//         : shortPositions.push(event.args[2]);
//     });
// });

setInterval(() => {
  getIndexPrice();
}, 45 * 1000);

// setTimeout(() => {
//   getIndexPrice();
// }, 100);
// closePosition(
//   "0x3F8F6796FC06C5400B70D62A274A93A3CAB09C4E2583AC7F162E59FF1F603B0C",
//   true
// );

// claimRewards();

// nohup node trading.js > trading.out 2>&1 &
