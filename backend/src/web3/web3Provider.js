const { Web3, WebSocketProvider } = require("web3");
require("dotenv").config();

// const websocketUrl = `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;
const websocketUrl = `wss://ethereum-sepolia-rpc.publicnode.com`;

function subscribeToEvents(callback) {
  console.log(`run callback: ${Date.now()}`);
  callback();
}

// WebSocketProvider를 사용하여 Web3 인스턴스 생성
function createWeb3Instance() {
  const provider = new WebSocketProvider(
    websocketUrl,
    {},
    {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 999999999,
      onTimeout: true,
    }
  );
  const web3 = new Web3(provider);

  provider.on("connect", () => {
    console.log(`WebSocket connected ${Date.now()}`);
    if (typeof global.subscribeCallback === "function") {
      subscribeToEvents(global.subscribeCallback); // 재연결 후 구독 설정
    }
  });

  provider.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  provider.on("reconnect", (attempt) => {
    console.log(`Reconnecting... Attempt: ${attempt} ${Date.now()}`);
    if (typeof global.subscribeCallback === "function") {
      subscribeToEvents(global.subscribeCallback); // 재연결 후 구독 설정
    }
  });

  provider.on("close", (code, reason) => {
    console.log(`WebSocket closed. Code: ${code}, Reason: ${reason}`);
  });

  return web3;
}

process.on("uncaughtException", (error) => {
  console.error("uncaughtException:", error.message);
});

const web3 = createWeb3Instance();
module.exports = {
  web3,
  setSubscriptionCallback: (callback) => {
    global.subscribeCallback = callback;
  },
};
