var { ethers, WebSocketProvider, MaxUint256 } = require("ethers");
require("dotenv").config();
const { contracts } = require("./contracts/addresses.js");
const provider = new WebSocketProvider(
  "wss://ethereum-sepolia-rpc.publicnode.com"
);

const signer = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);

const baseAddress = "0x60aB00c8e53AC83E5773DBea4E65cf990B93E1Eb";
const quoteAddress = "0xa80091Ac67Db543368c272120ca3D0161fa8e69F";

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
  "0xedCEDE92285fbD2f1379E059896116600850Ba25",
  contracts.uniswapV2Pair.abi,
  signer
);

const routerContract = new ethers.Contract(
  contracts.uniswapV2Router.address,
  contracts.uniswapV2Router.abi,
  signer
);

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
  fromBlock: 6572103, // 시작 블록 번호
  toBlock: "latest", // 종료 블록 번호 ('latest'로 최신 블록까지 지정 가능)
  topics: [
    ethers.id(
      "UpdatePosition(address,address,bytes32,uint256,uint256,uint256,bool)"
    ), // 필터링할 이벤트 시그니처
  ],
};

// 과거 로그 가져오기
async function getPastLogs() {
  const logs = await provider.getLogs(filter);
  logs.forEach((log) => {
    console.log(log.data.slice(0, 66));
    clearingHouseContract
      .getPosition(signer.address, baseAddress, log.data.slice(0, 66))
      .then((res) => console.log(`["${log.data.slice(0, 66)}", ${res[3]}],`))
});
}

const positions = [

]

async function close() {
  for (const position of positions) {
    await closePosition(position[0], position[1]);
  }
}

// getPastLogs();
close();
