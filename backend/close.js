var { ethers, WebSocketProvider, MaxUint256 } = require("ethers");
require("dotenv").config();
const { contracts } = require("./contracts/addresses.js");
const provider = new WebSocketProvider(
  "wss://ethereum-sepolia-rpc.publicnode.com"
);

const signer = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);

const baseAddress = "0x573a8d46b10a9805d2ab8cfa00eb56f3929c67c0";
const quoteAddress = "0x406f57d7f5e6a147d34bfaa03ec4f773f00d1190";

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

const poolContract = new ethers.Contract(
  "0xbcd1303b714fa157b151457189f2a1fd22b725df",
  contracts.uniswapV2Pair.abi,
  signer
);

const routerContract = new ethers.Contract(
  contracts.uniswapV2Router.address,
  contracts.uniswapV2Router.abi,
  signer
);

let longPositions = [
  "0x99E382DD9A60BC30446A1BC74511DCE2C82725D99F83C32DE7CDD8DDBC21283D",
  "0xBC851A6D7C4862B92AAD130677B519615CCCA3AE2C782C2B0A3EC2E9FCDD1D4E",
  "0x0EBF4AB858E84DCBE4F215FD3C345D8D759F082DE655661F2D827D8B19489BBC",
  "0x1BF7ECD9D9B91710E585EC5F2B1187F6F18FB54C6EAFB02FCDBBEB67FE7719C4",
];
let shortPositions = [];

const closePosition = async (positionHash, isLong) => {
  const slippageAdjustedAmount = isLong ? 0 : MaxUint256;
  await clearingHouseContract.closePosition(
    baseAddress,
    positionHash,
    100n,
    slippageAdjustedAmount,
    Math.floor(Date.now() / 1000) + 600,
    {
      gasLimit: 400000,
    }
  );
};

// event UpdatePosition(address indexed trader, address indexed baseToken, bytes32 positionHash, uint margin, uint positionSize, uint openNotional);
const filter = {
  address: contracts.clearingHouse.address, // 특정 컨트랙트 주소
  fromBlock: 6501374, // 시작 블록 번호
  toBlock: "latest", // 종료 블록 번호 ('latest'로 최신 블록까지 지정 가능)
  topics: [
    ethers.id(
      "UpdatePosition(address,address,bytes32,uint256,uint256,uint256)"
    ), // 필터링할 이벤트 시그니처
  ],
};

// 과거 로그 가져오기
async function getPastLogs() {
  const logs = await provider.getLogs(filter);
  logs.forEach((log) =>
    clearingHouseContract
      .getPosition(signer.address, baseAddress, log.data.slice(0, 66))
      .then((res) => console.log(log.data.slice(0, 66), res[3]))
  );
}

// const positions =

async function close() {
  for (const position of positions) {
    await closePosition(position.positionHash, position.isLong);
  }
}

// getPastLogs();
close();
