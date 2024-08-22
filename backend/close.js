var { ethers, WebSocketProvider, MaxUint256 } = require("ethers");
require("dotenv").config();
const { contracts } = require("./contracts/addresses.js");
const provider = new WebSocketProvider(
  "wss://ethereum-sepolia-rpc.publicnode.com"
);

const signer = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);

const baseAddress = "0x56f7b6eD57d7Ce8804F6f89Dc38D5dF5Ef1f8499";
const quoteAddress = "0x3EA41003BC70e4da782567359B16C47CcF4650C3";

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
  "0xAc4EB76D5eA83Ec19cD88BA2e637415eA0D4428C",
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

async function close() {
  await closePosition(
    "0x235fadb12c67cac1ebd40c09e8463be355995ee95bff02f9b545148856ee4be6",
    true
  );
  await closePosition(
    "0x6095b3818bf260de750582bd8e7c6df741017d4f5c0bc2223816d2b7f388be5c",
    true
  );
  await closePosition(
    "0x18be9ddebc62708e953be132121bb0ee381dcc4d98055459e982fcf378a82c79",
    true
  );
  await closePosition(
    "0x5c419d798ef30d7cce6b47b289d65bbb04aa1c8c7b6e839d60a72b323d025eed",
    true
  );
  await closePosition(
    "0x8b66e308511aad000660a2cb5ef781dbb3a60cac062ec920e38d480c7022a8a4",
    true
  );
  await closePosition(
    "0x7fcf9971d7246e95cc63c79bb9aaf126530d504ec4f055937b75460348d31ea6",
    true
  );
  await closePosition(
    "0x8bca6189829f65cde725c6d5691c5fcd89c0df7a6e672815417dd2443ecc0bae",
    true
  );
  await closePosition(
    "0x8bca6189829f65cde725c6d5691c5fcd89c0df7a6e672815417dd2443ecc0bae",
    true
  );
  await closePosition(
    "0x8816e21d0d093e442bee6fcbddb2943fb3d46a6cc6284f71496c36f6c5ab0827",
    true
  );
  await closePosition(
    "0x8bca6189829f65cde725c6d5691c5fcd89c0df7a6e672815417dd2443ecc0bae",
    true
  );
  await closePosition(
    "0x8bca6189829f65cde725c6d5691c5fcd89c0df7a6e672815417dd2443ecc0bae",
    true
  );
  await closePosition(
    "0x8bca6189829f65cde725c6d5691c5fcd89c0df7a6e672815417dd2443ecc0bae",
    true
  );
}

// getPastLogs();
close();
